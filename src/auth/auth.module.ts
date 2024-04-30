import { Module } from '@nestjs/common';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './startegy/jwt.strategy';
import { AuthServiceTokens } from './auth.service.token';

@Module({
    imports:[
        
        JwtModule.register({
        secret: "test",
        signOptions: { expiresIn: '43200s' } // 12h
    })],
    controllers: [AuthController],
    providers: [
        {
            provide: 'AUTH_SERVICE',
            useClass: AuthService
        },
        AuthService,
        AuthServiceTokens, 
        JwtStrategy
    ],
    exports: [
        {
            provide: 'AUTH_SERVICE',
            useClass: AuthService
        },
        AuthServiceTokens
    ]
})
export class AuthModule {}
