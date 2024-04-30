export interface KeyValuePair<V = any> {
    [key: string]: V
  }
  
  export interface RefreshTokenDetails {
    userEmail: string
    accessToken: string
    refreshToken?: string
    expiresUtc?: Date
    issuedUtc?: Date
    clientId?: string
    protectedTicket?: string
  }
  