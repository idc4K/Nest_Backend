import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { isProduction, isStaging } from './constants';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerService } from './logger/logger.service';
import { formatCodeGraphQlError } from './graphql/graphql.error';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';


let envFilePath = '.env.development'
if (isProduction()) {
  envFilePath = '.env.production'
}
else if (isStaging()) {
  envFilePath = '.env.staging'
}
else if (process.env.NODE_ENV === 'TEST') {
  envFilePath = '.env.testing'
}

console.log(`Running in ${envFilePath}`)
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      logger: new LoggerService(),
      driver: ApolloDriver,
      autoSchemaFile:  join(process.cwd(), 'src/schema.gql'),
      playground: true,
      formatError: (error) => {
        formatCodeGraphQlError(error)
        return error
      }
    }),
    AuthModule, 
    UserModule, 
    PrismaModule,
    LoggerModule,
    JwtModule
  ],
})
export class AppModule {
  public configure (consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
