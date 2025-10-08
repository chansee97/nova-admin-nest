import { Module, Global } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '@/modules/system/user/user.module'
import { LoginLogModule } from '@/modules/monitor/login-log/login-log.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CaptchaService } from './captcha.service'
import { config } from '@/config'
import { DataScopeService } from '@/modules/auth/data-scope.service'
import { Dept } from '@/modules/system/dept/entities/dept.entity'

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, CaptchaService, Reflector, DataScopeService],
  imports: [
    UserModule,
    LoginLogModule,
    TypeOrmModule.forFeature([Dept]),
    JwtModule.register({
      secret: config.jwt.secret,
      global: true,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }),
  ],
  exports: [AuthService, DataScopeService],
})
export class AuthModule {}
