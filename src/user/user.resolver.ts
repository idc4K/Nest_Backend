import { handleGraphQLError } from 'src/graphql/graphql.error'
import { UseGuards } from '@nestjs/common'
import { GraphQlAuthGuard } from 'src/auth/guards'
import { Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './user'

@Resolver(() => User)
export class UserResolver {
  constructor (private readonly userService: UserService) {}

  // @Mutation(() => User, { name: 'createUser' })
  // createUser(@Args('createUserInput') createUserInput: User) {
  //   return this.userService.create(createUserInput)
  // }

  @Query(() => [User])
  @UseGuards(GraphQlAuthGuard)
  users () {
    try {
      return this.userService.find()
    }
    catch (e) {
      handleGraphQLError(e)
    }
  }

  // @Query(() => User, { name: 'findOneProject' })
  // findOne(@Args('id', { type: () => ID }) id: string) {
  //   return this.userService.findOne(id)
  // }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: User) {
  //   return this.userService.update(updateUserInput.id, updateUserInput)
  // }

  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => ID }) id: string) {
  //   return this.userService.remove(id)
  // }
}
