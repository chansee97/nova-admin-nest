import type { LoginAuthDto } from './dto/login-auth.dto'
import { CaptchaResponseDto } from './dto/captcha-response.dto'
import { AuthService } from './auth.service'
import { CaptchaService } from './captcha.service'
import { Body, Controller, HttpCode, Post, Get, Headers } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { Public } from '@/common/decorators'

@ApiTags('认证管理')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Public()
  @Get('captcha')
  @ApiOperation({ summary: '获取验证码', description: '获取图片验证码' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: CaptchaResponseDto,
  })
  getCaptcha(): CaptchaResponseDto {
    return this.captchaService.generateCaptcha()
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '用户登录', description: '用户登录获取访问令牌' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto)
  }

  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '退出登录',
    description: '用户退出登录，使token失效',
  })
  @ApiResponse({ status: 200, description: '退出成功' })
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
  @ApiOperation({
    summary: '刷新令牌',
    description: '使用刷新令牌获取新的访问令牌',
  })
  refreshToken(@Body() updateToken: { refreshToken: string }) {
    return this.authService.refreshToken(updateToken.refreshToken)
  }

  @Get('userInfo')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取当前用户信息',
    description: '通过token获取当前登录用户的详细信息和角色信息',
  })
  getUserInfo(@Headers('authorization') authorization: string) {
    // 提取Bearer token
    const token = authorization?.replace('Bearer ', '')
    if (!token) {
      throw new Error('未提供token')
    }
    return this.authService.getUserInfo(token)
  }
}
