import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/auth.signUp.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, JwtAuthGuard } from './guards';
import { AuthServiceTokens } from './auth.service.token';
import { isEmail, isStrongPassword } from 'class-validator';
import { UserWithCredentials } from './dto/userDetails.dto';
import { get } from 'http';
const crypto = require('crypto');

const passwordStrengthMessage =
  'Le mot de passe doit contenir au moins 6 charactères et:\n1 minuscule\n1 majuscule\n1 chiffre\n1 symbole ex: $,& ...';
const passOptions = {
  minLength: 6,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  // returnScore: false,
  // pointsPerUnique: 1,
  // pointsPerRepeat: 0.5,
  // pointsForContainingLower: 10,
  // pointsForContainingUpper: 10,
  // pointsForContainingNumber: 10,
  // pointsForContainingSymbol: 10
};
@Controller('Auth/')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    private readonly authServiceTokens: AuthServiceTokens,
  ) {}

  // api/auth/email/register
  @Post('email/register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { email, password } = req.body;
    if (!isEmail(email)) {
      res.json({ success: false, message: "Mauvais format d'email" });
      res.end();
    } else if (!isStrongPassword(password, passOptions)) {
      res.json({
        success: false,
        message:
          'Le mot de passe doit contenir au moins 6 charactères et:\n1 minuscule\n1 majuscule\n1 chiffre\n1 symbole ex: $,& ...',
      });
      res.end();
    } else {
      const user = await this.authService.validateUserEmail(
        req.body,
        res,
        'register',
      );
      const payload = { user, accessToken: user.accessToken } as any;
      console.log('payload:::::::::::', payload);
      console.log('user:::::::::::', user);
      const jwt = await this.authService.login(payload);
      console.log('Jwt:::::::::::', jwt);
      res.set('authorization', jwt.accessToken);
      res.json(jwt);
      res.end();
    }
  }

  // api/auth/email/login
  @Post('email/login')
  @UseGuards()
  async login(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.validateUserEmail(
      req.body,
      res,
      'login',
    ); // null provider accessToken
    const payload = { user, accessToken: user.accessToken } as any;
    const jwt = await this.authService.login(payload);
    res.set('authorization', jwt.accessToken);
    res.json(jwt);
    res.end();
  }
  //reset password
  // api/auth/reset/sendEmail
  @Post('reset/sendEmail')
  @UseGuards()
  async emailReset(@Req() req: Request, @Res() res: Response) {
    const otp = crypto.randomBytes(40).toString('hex');
    await this.authService.sendResetEmail(req, otp, res);
    res.end();
  }
  // api/auth/reset/forgot
  @Post('reset/forgot')
  @UseGuards()
  async resetPasswordForgot(@Req() req: Request, @Res() res: Response) {
    const { password, otp } = req.body;
    if (!isStrongPassword(password, passOptions))
      throw new BadRequestException(passwordStrengthMessage);
    else {
      await this.authService.resetPasswordForgot(password, otp, res);
      res.end();
    }
  }

  // api/auth/change/sendEmail
  @Post('change/sendEmail')
  @UseGuards(JwtAuthGuard)
  async emailChangePassword(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() user: UserWithCredentials,
  ) {
    const otp = crypto.randomBytes(40).toString('hex');
    await this.authService.sendChangeEmail(req, user.email, otp);
    res.end();
  }

  // api/auth/reset/intentional
  @Post('reset/intentional')
  @UseGuards(JwtAuthGuard)
  async resetPasswordIntentional(@Req() req: Request, @Res() res: Response) {
    const { newPassword, oldPassword, otp } = req.body;
    if (!isStrongPassword(newPassword, passOptions))
      throw new BadRequestException(passwordStrengthMessage);
    await this.authService.resetPasswordIntentional(
      oldPassword,
      newPassword,
      otp,
      res,
    );
    res.end();
  }
  @Get('users')
  //@UseGuards(JwtAuthGuard)
  async users() {
    return await this.authService.getAllUSers();
  }

  // @Delete('delete')
  // @UseGuards(JwtAuthGuard)
  // async deleteAccount (@CurrentUser() user: UserWithCredentials, @Res() res: Response) {
  //   return await this.authService.delete(user.id, res)
  // }
}
