import type { AuthService } from './auth.service'
import type { LoginAuthDto } from './dto/login-auth.dto'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { Public } from '@/common/decorators'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto)
  }

  @Public()
  @Post('refreshToken')
  refreshToken(@Body() updateToken: { refreshToken: string }) {
    return this.authService.refreshToken(updateToken.refreshToken)
  }
}
