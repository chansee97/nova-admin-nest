import { Injectable } from '@nestjs/common'
import { RedisService } from '@/modules/redis/redis.service'
import { RedisKey } from '@/common/enums'
import { v4 as uuidv4 } from 'uuid'
import { generateCaptchaImage, validateCaptchaText } from '@/utils/captcha'
import { ApiException } from '@/common/filters'
import { ApiErrorCode } from '@/common/enums'
import { config } from '@/config'
import type { AppConfig } from '@/config'

/**
 * 验证码服务
 */
@Injectable()
export class CaptchaService {
  private captchaConfig: AppConfig['captcha']

  constructor(private readonly redisService: RedisService) {
    this.captchaConfig = config.captcha
  }

  /**
   * 生成图片验证码
   */
  async generateCaptcha(): Promise<{
    captchaId: string
    captchaImage: string
    enabled: boolean
  }> {
    // 如果验证码未启用，返回空数据
    if (!this.captchaConfig.enabled) {
      return {
        captchaId: '',
        captchaImage: '',
        enabled: false,
      }
    }

    // 使用工具函数生成验证码
    const captcha = generateCaptchaImage({
      size: this.captchaConfig.size,
      type: this.captchaConfig.type,
    })

    // 使用 UUID 生成唯一ID
    const captchaId = uuidv4()

    // 存储到 Redis，并设置过期时间
    await this.redisService.set(
      `${RedisKey.CAPTCHA}${captchaId}`,
      captcha.text,
      this.captchaConfig.expiresIn,
    )

    return {
      captchaId,
      captchaImage: captcha.data,
      enabled: true,
    }
  }

  /**
   * 验证验证码
   */
  async verifyCaptcha(captchaId: string, userInput: string): Promise<boolean> {
    // 如果验证码未启用，直接返回 true
    if (!this.captchaConfig.enabled) {
      return true
    }

    if (!captchaId || !userInput) {
      throw new ApiException('验证码不能为空', ApiErrorCode.SERVER_ERROR)
    }

    const storedCode = await this.redisService.get<string>(
      `${RedisKey.CAPTCHA}${captchaId}`,
    )

    if (!storedCode) {
      throw new ApiException('验证码不存在或已过期', ApiErrorCode.SERVER_ERROR)
    }

    // 使用工具函数验证验证码
    const isValid = validateCaptchaText(
      userInput,
      storedCode,
      this.captchaConfig.caseSensitive,
    )

    // 验证后删除验证码（一次性使用）
    await this.redisService.del(`${RedisKey.CAPTCHA}${captchaId}`)

    if (!isValid) {
      throw new ApiException('验证码错误', ApiErrorCode.SERVER_ERROR)
    }

    return true
  }
}
