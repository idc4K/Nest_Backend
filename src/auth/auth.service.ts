import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { UserDetails } from './dto/userDetails.dto';
import { AuthServiceTokens } from './auth.service.token';
import { Request, Response } from 'express';
import { OAuthStrategyResponse } from './auth';
import { getDateExpires } from 'src/utils';
import axios from 'axios';
import { RefreshTokenDetails } from 'src/utils/types';
import { RolesEnum } from 'src/common/enums';
import { RefreshToken } from 'src/refreshToken/refreshToken.entity';
import { User } from 'src/user/user';

@Injectable({})
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private authserviceTokens: AuthServiceTokens,
  ) {}

  async createUser(userDetails: UserDetails) {
    const { email } = userDetails;

    const refreshToken = new RefreshToken();

    refreshToken.userEmail = email;
    refreshToken.createdBy = email;

    const user = await this.prismaService.user.create({
      data: {
        ...userDetails,
        createdBy: email,
        providers: {},
        refreshToken: {
          connectOrCreate: {
            where: { userEmail: email }, // Assuming userEmail is the correct field for connecting to RefreshToken
            create: refreshToken,
          },
        },
      },
    });

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        providers: {
          connectOrCreate: userDetails.providers.map((p) => ({
            where: {
              provider_userId: { userId: user.id, provider: p.provider },
            },
            create: { provider: p.provider, createdBy: email },
          })),
        },
      },
    });
  }

  async validateUser(userDetails: UserDetails) {
    const { email } = userDetails;
    const user = await this.prismaService.user.findFirst({
      where: { email },
      include: { providers: true },
    });

    if (user) {
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          providers: {
            connectOrCreate: userDetails.providers.map((p) => ({
              where: {
                provider_userId: { userId: user.id, provider: p.provider },
              },
              create: { provider: p.provider, createdBy: email },
            })),
          },
        },
      });
      return user;
    }
    return await this.createUser(userDetails);
  }

  async createUserEmail(userDetails: UserDetails) {
    const { email, password } = userDetails;
    const hash = bcrypt.hashSync(password);

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hash,
        createdBy: email,
      },
    });
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        providers: {
          create: {
            provider: 'email',
          },
        },
      },
    });

    return user;
  }

  async sendLoginEmailError(res: Response) {
    res.json({ success: false, message: "Erreur d'authentification" });
    res.end();
    // throw new Error('Erreur d\'authentification')
  }

  async validateUserEmail(
    userDetails: UserDetails,
    res: Response,
    option: string,
  ) {
    const { email, password } = userDetails;

    const user = await this.prismaService.user.findFirst({
      where: { email },
      include: { providers: {}, refreshToken: {} },
    });

    if (option === 'register') {
      if (!user) {
        return await this.createUserEmail(userDetails);
      } else {
        this.sendLoginEmailError(res);
      }
    }

    if (option === 'login') {
      if (!user) {
        this.sendLoginEmailError(res);
      }
      if (user.password != null) {
        const isSamePassword = bcrypt.compareSync(password, user.password);
        // good password
        if (isSamePassword) {
          return user;
        }
        // wrong password
        else {
          this.sendLoginEmailError(res);
        }
      } else {
        this.sendLoginEmailError(res);
      }
    }
  }

  async createRefreshToken(userEmail: string, userId: string) {
    const newRefreshToken = await this.authserviceTokens.getJwtRefreshToken(
      userEmail,
      userId,
    );
    // calculate refreshToken expiry date
    const dateExpires = getDateExpires(
      process.env.REFRESHTOKEN_EXPIRATION_METRIC,
      process.env.REFRESHTOKEN_EXPIRATION_TIME,
    );

    // create refreshToken
    const rt = this.prismaService.refreshToken.create({
      data: {
        userEmail,
        createdBy: userEmail,
        refreshToken: newRefreshToken,
        expiresUtc: dateExpires,
        issuedUtc: new Date(),
        createdAt: new Date(),
        userId,
      },
    });
    return rt;
  }

  async login(payload: OAuthStrategyResponse) {
    const { user } = payload;
    const userEmail = user.email;

    // create refreshToken
    const existingTokenUser = await this.prismaService.refreshToken.findFirst({
      where: { userEmail },
    });
    if (existingTokenUser) {
      await this.authserviceTokens.revokeUserRefreshToken(userEmail);
    }

    const refreshToken = await this.authserviceTokens.createRefreshToken(
      userEmail,
      user.id,
    );

    // update modifiedby
    await this.prismaService.refreshToken.update({
      where: {
        userEmail,
      },
      data: {
        ...refreshToken,
        modifiedBy: userEmail,
      },
    });

    // const providerToken = this.jwtService.decode(accessToken) as any
    // create accessToken
    const aToken = await this.authserviceTokens.getJwtAccessToken(
      userEmail,
      user.id,
      // providerToken.providerAccessToken
    );
    const dateExpires = getDateExpires(
      process.env.ACCESSTOKEN_EXPIRATION_TIME_METRIC,
      process.env.ACCESSTOKEN_EXPIRATION_TIME,
    );

    // save accessToken
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: aToken,
        accessTokenExpiresUtc: dateExpires,
      },
    });

    return {
      accessToken: aToken,
      refreshToken: refreshToken.refreshToken,
    };
  }

  async logout(accessToken: string) {
    const user = await this.prismaService.user.findFirst({
      where: { accessToken },
    });
    this.authserviceTokens.revokeUserRefreshToken(user.email);
  }

  async sendResetEmail(req: Request, oneTimePassword: string, res: Response) {
    const { email } = req.body as any;
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { providers: true },
    });
    if (!user) {
      res.json({
        success: true,
        message: "Email envoyé à l'adresse mail spécifiée",
      });
      res.end();
      return null;
    }
    const frontUrl = req.headers.origin;
    const emailToSend = {
      sender: { email: process.env.OWNER_EMAIL },
      to: [{ email }],
      // Customize Email content
      subject: 'Réinitialisation mot de passe - Kapix',
      htmlContent: `
     <html>
       <body>
         <p>M./Mme,</p>
         <p>Votre demande de réinitialisation de mot de passe a été prise en compte.</p>
         <p>Merci de suivre le lien ci-dessous pour compléter le processus:</p>
         <p>${frontUrl}/nouveaumotdepasse?otp=${oneTimePassword}</p>
         <p>Bien Cordialement,</p>
         <p>L'équipe Kapix</p>
       </body>
     </html>`,
    };
    try {
      await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        emailToSend,
        {
          headers: {
            Accept: 'application/json',
            'api-key': process.env.SENDINBLUE_KEY,
          },
        },
      );
      this.prismaService.user.update({
        where: { id: user.id },
        data: {
          oneTimePassword,
        },
      });
      res.json({
        success: true,
        message: "Email envoyé à l'adresse mail spécifiée",
      });
    } catch (error) {
      res.json({
        success: true,
        message: "Email envoyé à l'adresse mail spécifiée",
      });
      res.end();
      throw new Error(error as any);
    }
  }

  async sendChangeEmail(req: Request, oneTimePassword: string, res: Response) {
    const { email } = req.body as any;
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { providers: true },
    });
    if (!user) {
      res.json({
        success: true,
        message: "Email envoyé à l'adresse mail spécifiée",
      });
      res.end();
      return null;
    }
    const frontUrl = req.headers.origin;
    const emailToSend = {
      sender: { email: process.env.OWNER_EMAIL },
      to: [{ email }],
      // Customize Email content
      subject: 'Réinitialisation mot de passe - Kapix',
      htmlContent: `
     <html>
       <body>
         <p>M./Mme,</p>
         <p>Votre demande de réinitialisation de mot de passe a été prise en compte.</p>
         <p>Merci de suivre le lien ci-dessous pour compléter le processus:</p>
         <p>${frontUrl}/nouveaumotdepasse?otp=${oneTimePassword}</p>
         <p>Bien Cordialement,</p>
         <p>L'équipe Kapix</p>
       </body>
     </html>`,
    };
    try {
      await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        emailToSend,
        {
          headers: {
            Accept: 'application/json',
            'api-key': process.env.SENDINBLUE_KEY,
          },
        },
      );
      this.prismaService.user.update({
        where: { id: user.id },
        data: {
          oneTimePassword,
        },
      });
      res.json({
        success: true,
        message: "Email envoyé à l'adresse mail spécifiée",
      });
    } catch (error) {
      res.json({
        success: true,
        message: "Email envoyé à l'adresse mail spécifiée",
      });
      res.end();
      throw new Error(error as any);
    }
  }

  async resetPasswordForgot(
    password: string,
    oneTimePassword: string,
    res: Response,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: { oneTimePassword },
    });

    if (!user) {
      res.json({ success: false, message: 'Action invalide' });
      res.end();
      throw new Error('Action invalide');
    }

    // write new password and delete oneTimePassword
    const hash = bcrypt.hashSync(password);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        oneTimePassword: null,
      },
    });
    res.json({ success: true, message: 'Mot de passe modifié' });
    res.end();
  }

  async resetPasswordIntentional(
    newPassword: string,
    email: string,
    oldPassword: string,
    res: Response,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.json({ success: false, message: 'Action invalide' });
      res.end();
      return null;
    }

    // Comparison between old password fields and db password
    const isSamePassword = bcrypt.compareSync(oldPassword, user.password);
    // Bad password
    if (isSamePassword) {
      const hash = bcrypt.hashSync(newPassword);
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: hash,
        },
      });
      res.json({ success: true, message: 'Mot de passe modifié' });
      res.end();
    }
    // Right password
    else {
      res.json({ success: false, message: 'Action invalide' });
      res.end();
    }
  }

  sendAccessToken(
    jwt: { accessToken: string; refreshToken: string | null },
    payload: OAuthStrategyResponse,
    req: Request,
    res: Response,
  ) {
    let refreshToken = '';
    const { user } = payload;
    if (jwt.refreshToken) {
      refreshToken = `&refreshToken=${jwt.refreshToken}`;
    }
    res.set('authorization', jwt.accessToken);
    res.set('refresh', jwt.refreshToken);
    res.redirect(
      301,
      `${req.query.state}?accessToken=${jwt.accessToken}${refreshToken}&email=${user.email}&name=${user.displayName}`,
    );
  }
  async getAllUSers() {
    return this.prismaService.user.findMany();
  }

  // method for jwtRefreshGuard
  // get new Tokens if refresh Token and user exist and correspond
  // async getNewTokensIfRefreshTokenMatches(
  //   refreshToken: string,
  //   payload: any
  // ) {
  //   const foundToken = await this.prismaService.refreshToken.findFirst({
  //     where: {
  //       refreshToken,
  //       userEmail: payload.email
  //     }
  //   })

  //   const isMatch = foundToken && (refreshToken === foundToken.refreshToken)

  //   if (foundToken == null) {
  //     // refresh token is valid but not in database
  //     // TODO:inform the user with the payload sub
  //     throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
  //   }
  //   if (isMatch) {
  //     return await this.authserviceTokens.generateTokens(payload)
  //   }
  //   else {
  //     throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST)
  //   }
  // }

  async findUserByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }
}
