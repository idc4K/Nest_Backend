
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { User as UserDB } from '@prisma/client'

@ObjectType()
export class User {
  @Field(() => String)
  id: UserDB["id"]

  @Field(() => String)
  email: UserDB["email"]




  // Associations
}
