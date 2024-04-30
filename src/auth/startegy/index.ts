import type { Profile as GoogleProfile } from 'passport-google-oauth20'
import {
  Strategy as PassportGoogleStrategy
} from 'passport-google-oauth20'
import type { Profile as FacebookProfile } from 'passport-facebook'
import {
  Strategy as PassportFacebookStrategy
} from 'passport-facebook'
import type { Profile as DiscordProfile } from 'passport-discord'
import {
  Strategy as PassportDiscordStrategy
} from 'passport-discord'
import type { Profile as GitlabProfile } from 'passport-gitlab2'
import {
  Strategy as PassportGitlabStrategy
} from 'passport-gitlab2'
import type { Profile as GithubProfile } from 'passport-github2'
import {
  Strategy as PassportGithubStrategy
} from 'passport-github2'
import {
  Strategy as PassportFigmaStrategy
} from 'passport-figma2'
import type { Profile as TwitchProfile } from 'twitch-passport'
import {
  Strategy as PassportTwitchStrategy
} from 'twitch-passport' 
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import type { ProviderEnum } from 'src/constants/enum'
import { IAuthenticationProvider } from '../auth'

@Injectable()
export class GoogleStrategy extends PassportStrategy(PassportGoogleStrategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    })
  }

  authenticate(req, options) {
    options.state = req.query.redirectUri
    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile) {
    const {
      emails,
      username,
      provider,
      id
    } = profile
    const providerName = provider as ProviderEnum
    const user = await this.authService.validateUser({
      email: emails[0].value,
      username,
      providers: [
        {
          provider: providerName,
          providerId: id
        }
      ]
    })
    return { user, accessToken, refreshToken, provider: providerName } || null
  }
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(PassportFacebookStrategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      scope: ['email'],
      profileFields: ['emails'] // Both options scope & profileFields are required
    })
  }

  authenticate(req, options) {
    options.state = req.query.redirectUri
    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: FacebookProfile) {
    const {
      emails,
      username,
      provider,
      id
    } = profile
    const providerName = provider as ProviderEnum
    const user = await this.authService.validateUser({
      email: emails[0].value,
      username,
      providers: [{ provider: providerName, providerId: id }]
    })
    return { user, accessToken, refreshToken, provider: providerName } || null
  }
}

// https://discord.com/developers/applications
@Injectable()
export class DiscordStrategy extends PassportStrategy(PassportDiscordStrategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'email'],
      passReqToCallback: true
    })
  }

  authenticate(req, options) {
    options.state = req.query.redirectUri
    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: DiscordProfile) {
    const {
      email,
      username,
      provider,
      id
    } = profile

    const providerName = provider as ProviderEnum
    const user = await this.authService.validateUser({
      email,
      username,
      providers: [
        {
          provider: providerName,
          providerId: id
        }
      ]
    })
    return { user, accessToken, refreshToken, provider: providerName } || null
  }
}

@Injectable()
export class GithubStrategy extends PassportStrategy(PassportGithubStrategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user', 'repo']
    })
  }

  authenticate(req, options) {
    options.state = req.query.redirectUri
    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: GithubProfile) {
    const {
      emails,
      username,
      provider,
      id
    } = profile
    const providerName = provider as ProviderEnum
    const user = await this.authService.validateUser({
      email: emails[0].value,
      username,
      providers: [{ provider: providerName, providerId: id }]
    })
    return { user, accessToken, refreshToken, provider: providerName } || null
  }
}

@Injectable()
export class GitlabStrategy extends PassportStrategy(PassportGitlabStrategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      clientID: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      callbackURL: process.env.GITLAB_CALLBACK_URL,
      scope: ['api'] // scope email or profile doesnt work ...
    })
  }

  authenticate(req, options) {
    options.state = req.query.redirectUri
    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: GitlabProfile) {
    const {
      emails,
      username,
      provider,
      id
    } = profile
    const providerName = provider as ProviderEnum
    const user = await this.authService.validateUser({
      email: emails[0].value,
      username,
      providers: [{ provider: providerName, providerId: id }]
    })
    return { user, accessToken, refreshToken, provider: providerName } || null
  }
}

@Injectable()
export class FigmaStrategy extends PassportStrategy(PassportFigmaStrategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      clientID: process.env.FIGMA_CLIENT_ID,
      clientSecret: process.env.FIGMA_CLIENT_SECRET,
      callbackURL: process.env.FIGMA_CALLBACK_URL,
      scope: 'files:read',
      response_type: 'code',
      grant_type: 'authorization_code',
      skipUserProfile: true // to not fetch user and just have token
    })
  }

  authenticate(req, options) {
    options.state = req.query.redirectUri
    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const {
      emails,
      displayName,
      provider,
      id
    } = profile
    const providerName = provider as ProviderEnum
    const user = await this.authService.validateUser({
      email: emails[0].value,
      username: displayName,
      providers: [{ provider: providerName, providerId: id }]
    })
    return { user, accessToken, refreshToken, provider: providerName } || null
  }
}

@Injectable()
export class TwitchStrategy extends PassportStrategy(PassportTwitchStrategy, 'twitch') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {
    super({
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: process.env.TWITCH_CALLBACK_URL,
      // state: true,
      scope: ['user:read:email']
    })
  }

  authenticate(req, options) {
    options.state = req.query.redirectUri
    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: TwitchProfile) {
    const {
      username,
      provider,
      id
    } = profile
    const providerName = provider as ProviderEnum
    const user = await this.authService.validateUser({
      email: profile._json.data[0].email, // WARNING take care about deprecation of this line
      username,
      providers: [{ provider: providerName, providerId: id }]
    })
    return { user, accessToken, refreshToken, provider: providerName } || null
  }
}
