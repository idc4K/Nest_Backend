import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Tracking } from 'src/common/tracking'

@ObjectType()
export class RefreshToken  extends Tracking{
  @Field(() => ID)
  id: string

  @Field()
  userEmail: string

  @Field({ nullable: true })
  accessToken?: string

  @Field({ nullable: true })
  refreshToken?: string

  @Field(() => Date, { nullable: true })
  expiresUtc?: Date

  @Field(() => Date, { nullable: true })
  issuedUtc?: Date

  @Field({ nullable: true })
  clientId?: string

  @Field({ nullable: true })
  protectedTicket?: string

  // Associations
}
