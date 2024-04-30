import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { IAuthenticationProvider } from '../auth'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
      passReqToCallback: true
    })
  }

  async validate(request: Request, payload: any) {
    const refreshToken = request.header('Authorization').split(' ')[1]
    return await this.authService.getNewTokensIfRefreshTokenMatches(
      refreshToken,
      payload
    )
  }
}
