import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import { createdAtColumnName, createdByColumnName } from 'src/middleware/resolversInterceptor'
import { getDateExpires } from 'src/utils'

export const prisma = new PrismaClient()

@Injectable()
export class AuthServiceTokens {
  constructor(private jwtService: JwtService) {}

  // async generateTokens(payload: any) {
  //   const user = await prisma.user.findUnique({
  //     where: { email: payload.email }
  //   })

  //   // generate new access token with providerAccessToken
  //   const providerToken = this.jwtService.decode(user.accessToken) as any
  //   const aToken = await this.getJwtAccessToken(
  //     payload.email,
  //     user.id,
  //     providerToken.providerAccessToken
  //   )

  //   // fill dates
  //   const dateExpires = getDateExpires(process.env.ACCESSTOKEN_EXPIRATION_TIME_METRIC, process.env.ACCESSTOKEN_EXPIRATION_TIME)

  //   await prisma.user.update({
  //     where: {
  //       email: payload.email
  //     },
  //     data: {
  //       accessToken: aToken,
  //       accessTokenExpiresUtc: dateExpires
  //     }
  //   })

  //   // generate new refreshToken
  //   await prisma.refreshToken.delete({ where: { userEmail: user.email } })
  //   const newRefreshToken = await this.createRefreshToken(user.email, user.id)

  //   return {
  //     accessToken: aToken,
  //     refreshToken: newRefreshToken.refreshToken,
  //     // accessTokenExpires: getAccessExpiry(),
  //     email: payload.email
  //   }
  // }

  async getJwtAccessToken(
    email: string,
    userId: string,
    providerAccessToken?: string
  ) {
    const payload = { email, sub: userId, providerAccessToken }
    const aToken = await this.jwtService.signAsync(payload, {
      secret: process.env.TOKENS_SECRET,
      expiresIn: `${process.env.ACCESSTOKEN_EXPIRATION_TIME}${process.env.ACCESSTOKEN_EXPIRATION_TIME_METRIC}`
    })
    return aToken
  }

  async getJwtRefreshToken(
    email: string,
    userId: string
  ) {
    const payload = { email, sub: userId }
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.TOKENS_SECRET,
      expiresIn: `${process.env.REFRESHTOKEN_EXPIRATION_TIME}${process.env.REFRESHTOKEN_EXPIRATION_METRIC}`
    })
    return refreshToken
  }

  async createRefreshToken(userEmail: string, userId: string) {
    const newRefreshToken = await this.getJwtRefreshToken(
      userEmail,
      userId
    )
    // calculate refreshToken expiry date
    const dateExpires = getDateExpires(process.env.REFRESHTOKEN_EXPIRATION_METRIC, process.env.REFRESHTOKEN_EXPIRATION_TIME)

    // create refreshToken
    const rt = prisma.refreshToken.create({
      data: {
        userEmail,
        [createdByColumnName]: userEmail,
        refreshToken: newRefreshToken,
        expiresUtc: dateExpires,
        issuedUtc: new Date(),
        [createdAtColumnName]: new Date(),
        userId
      }
    })
    return rt
  }

  async revokeUserRefreshToken(userEmail: string) {
    const user = await prisma.user.findFirst({ where: { email: userEmail } })
    // revoke accessToken
    await prisma.user.update({
      where: { id: user.id },
      data: {
        accessToken: null
      }
    })
    // revoke refreshToken
    await prisma.refreshToken.delete({ where: { userEmail } })
  }
}
