import { Inject, UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { IAuthenticationProvider } from 'src/auth/auth'
import { CurrentUser, GraphQlAuthGuard } from 'src/auth/guards'
import { User } from 'src/user/user'
@Resolver(() => User)
@UseGuards(GraphQlAuthGuard)
export class AuthResolver {
  constructor (@Inject('AUTH_SERVICE') private readonly authService: IAuthenticationProvider) {}

  @Query(() => User)
  async getUser (@CurrentUser() user: User): Promise<User> {
    // const user = await this.authService.findUser()
    return user
  }
}
