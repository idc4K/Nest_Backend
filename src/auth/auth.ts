
import type { ProviderEnum } from 'src/constants/enum'
import type  { UserDetails } from './dto/userDetails.dto'
import { User } from '@prisma/client'

export interface OAuthStrategyResponse {
  user: User
  accessToken: string
  refreshToken: string
  provider: ProviderEnum
}

export interface IAuthenticationProvider {
  validateUser(details: UserDetails)
  createUser(details: UserDetails)
  login(user: OAuthStrategyResponse)
  findUserByEmail (email: string): Promise<User | undefined>
  getNewTokensIfRefreshTokenMatches (refreshToken: string, payload: any): any
}
