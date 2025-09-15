import type { LoginAuthDto } from './dto/login-auth.dto'
import { AuthService } from './auth.service'
import { CaptchaService } from './captcha.service'
import { Body, Controller, HttpCode, Post, Get, Headers } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Public } from '@/common/decorators'
import { ClientInfo } from '@/common/decorators/client-info.decorator'

@ApiTags('认证管理')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Public()
  @Get('captcha')
  @ApiOperation({ summary: '获取验证码' })
  getCaptcha() {
    return this.captchaService.generateCaptcha()
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '用户登录' })
  login(@Body() loginAuthDto: LoginAuthDto, @ClientInfo() clientInfo) {
    return this.authService.login(loginAuthDto, clientInfo)
  }

  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: '退出登录' })
  logout(@Headers('authorization') authorization: string) {
    // 提取Bearer token
    const token = authorization?.replace('Bearer ', '')
    if (!token) {
      throw new Error('未提供token')
    }
    return this.authService.logout(token)
  }

  @Public()
  @Post('refreshToken')
  @HttpCode(200)
  @ApiOperation({ summary: '刷新令牌' })
  refreshToken(@Body() updateToken: { refreshToken: string }) {
    return this.authService.refreshToken(updateToken.refreshToken)
  }

  @Get('userInfo')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  getUserInfo(@Headers('authorization') authorization: string) {
    // 提取Bearer token
    const token = authorization?.replace('Bearer ', '')
    if (!token) {
      throw new Error('未提供token')
    }
    return this.authService.getUserInfo(token)
  }

  @Get('userMenu')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户菜单' })
  getUserMenu(@Headers('authorization') authorization: string) {
    // 提取Bearer token
    const token = authorization?.replace('Bearer ', '')
    if (!token) {
      throw new Error('未提供token')
    }
    return this.authService.getUserMenus(token)
  }
}
