// import { handleGraphQLError } from 'src/graphql/graphql.error'
// import { UseGuards } from '@nestjs/common'
// import { GraphQlAuthGuard } from 'src/auth/guards'
// import { Query, Resolver } from '@nestjs/graphql'
// import { RefreshTokenService } from './refreshToken.service'
// import { RefreshToken } from './refreshToken.entity'

// @Resolver(() => RefreshToken)
// export class RefreshTokenResolver {
//   constructor (private readonly refreshTokenService: RefreshTokenService) {}

//   // @Mutation(() => RefreshToken, { name: 'createRefreshToken' })
//   // createRefreshToken(@Args('createRefreshTokenInput') createRefreshTokenInput: RefreshToken) {
//   //   return this.refreshTokenService.create(createRefreshTokenInput)
//   // }

//   @Query(() => [RefreshToken], { name: 'findAllRefreshToken' })
//   @UseGuards(GraphQlAuthGuard)
//   findAll () {
//     try {
//       return this.refreshTokenService.findAll()
//     }
//     catch (e) {
//       handleGraphQLError(e)
//     }
//   }

//   // @Query(() => RefreshToken, { name: 'findOneProject' })
//   // findOne(@Args('id', { type: () => ID }) id: string) {
//   //   return this.refreshTokenService.findOne(id)
//   // }

//   // @Mutation(() => RefreshToken)
//   // updateRefreshToken(@Args('updateRefreshTokenInput') updateRefreshTokenInput: RefreshToken) {
//   //   return this.refreshTokenService.update(updateRefreshTokenInput.id, updateRefreshTokenInput)
//   // }

//   // @Mutation(() => RefreshToken)
//   // removeRefreshToken(@Args('id', { type: () => ID }) id: string) {
//   //   return this.refreshTokenService.remove(id)
//   // }
// }
