import { Module } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '@/modules/system/user/user.module'
import { AuthController } from './auth.controller'
import { JwtGuard, AuthGuard } from '../../common/guards'
import { AuthService } from './auth.service'
import { CaptchaService } from './captcha.service'
import { config } from '@/config'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    CaptchaService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    UserModule,
    JwtModule.register({
      secret: config.jwt.secret,
      global: true,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
