import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'
import { generateCaptchaImage, validateCaptchaText } from '@/utils/captcha'
import { ApiException } from '@/common/filters'
import { ApiErrorCode } from '@/common/enums'
import type { AppConfig } from '@/config/type'

/**
 * 验证码服务
 */
@Injectable()
export class CaptchaService {
  // 内存存储验证码，生产环境建议使用 Redis
  private captchaStore = new Map<string, { code: string; expires: number }>()
  private captchaConfig: AppConfig['captcha']

  constructor(private configService: ConfigService) {
    this.captchaConfig =
      this.configService.get<AppConfig['captcha']>('app.captcha')
  }

  /**
   * 生成图片验证码
   */
  generateCaptcha(): {
    captchaId: string
    captchaImage: string
    enabled: boolean
  } {
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

    // 存储验证码，使用配置的过期时间
    const expires = Date.now() + this.captchaConfig.expiresIn * 1000
    this.captchaStore.set(captchaId, {
      code: captcha.text,
      expires,
    })

    // 清理过期的验证码
    this.cleanExpiredCaptcha()

    return {
      captchaId,
      captchaImage: captcha.data,
      enabled: true,
    }
  }

  /**
   * 验证验证码
   */
  verifyCaptcha(captchaId: string, userInput: string): boolean {
    // 如果验证码未启用，直接返回 true
    if (!this.captchaConfig.enabled) {
      return true
    }

    if (!captchaId || !userInput) {
      throw new ApiException('验证码不能为空', ApiErrorCode.SERVER_ERROR)
    }

    const stored = this.captchaStore.get(captchaId)

    if (!stored) {
      throw new ApiException('验证码不存在或已过期', ApiErrorCode.SERVER_ERROR)
    }

    // 检查是否过期
    if (Date.now() > stored.expires) {
      this.captchaStore.delete(captchaId)
      throw new ApiException('验证码已过期', ApiErrorCode.SERVER_ERROR)
    }

    // 使用工具函数验证验证码
    const isValid = validateCaptchaText(
      userInput,
      stored.code,
      this.captchaConfig.caseSensitive,
    )

    // 验证后删除验证码（一次性使用）
    this.captchaStore.delete(captchaId)

    if (!isValid) {
      throw new ApiException('验证码错误', ApiErrorCode.SERVER_ERROR)
    }

    return true
  }

  /**
   * 清理过期的验证码
   */
  private cleanExpiredCaptcha(): void {
    const now = Date.now()
    for (const [id, data] of this.captchaStore.entries()) {
      if (now > data.expires) {
        this.captchaStore.delete(id)
      }
    }
  }
}
