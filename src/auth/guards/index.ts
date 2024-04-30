import type { ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException, createParamDecorator } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import type { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return activate
  }

  handleRequest(err, user, _info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}

@Injectable()
export class GraphQlAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()
    return super.canActivate(new ExecutionContextHost([req]))
  }
}

export const CurrentLocale = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const { headers } = ctx.getContext().req
    const locale = headers.locale || headers.Locale
    // for now we only support en & fr
    return locale === 'fr' ? locale : 'en'
  }
)

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  }
)

export const CurrentRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
)
