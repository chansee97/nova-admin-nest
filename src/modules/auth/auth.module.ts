import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '@/modules/system/user/user.module'
import { AuthController } from './auth.controller'
import { JwtAuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { CaptchaService } from './captcha.service'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    CaptchaService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get('app.jwt')
        return {
          secret: jwtConfig.secret,
          global: true,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        }
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
