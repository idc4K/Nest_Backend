// import { Field, ObjectType } from "@nestjs/graphql"
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Tracking {
  @Field()
  createdBy: string

  @Field()
  createdAt: Date

  @Field({ nullable: true })
  modifiedBy?: string

  @Field({ nullable: true })
  modifiedAt?: Date
}
