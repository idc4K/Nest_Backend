export interface RefreshTokenDetails {
  userEmail: string
  accessToken: string
  refreshToken?: string
  expiresUtc?: Date
  issuedUtc?: Date
  clientId?: string
  protectedTicket?: string
}
