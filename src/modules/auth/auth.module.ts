import { Module } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '@/modules/system/user/user.module'
import { LoginLogModule } from '@/modules/monitor/login-log/login-log.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CaptchaService } from './captcha.service'
import { config } from '@/config'

@Module({
  controllers: [AuthController],
  providers: [AuthService, CaptchaService, Reflector],
  imports: [
    UserModule,
    LoginLogModule,
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
