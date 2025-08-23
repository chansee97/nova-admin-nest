import * as svgCaptcha from 'svg-captcha'

/**
 * 验证码配置接口
 */
export interface CaptchaConfig {
  /** 验证码长度 */
  size?: number
  /** 验证码类型 */
  type?: 'text' | 'math'
  /** 忽略的字符 */
  ignoreChars?: string
  /** 干扰线条数 */
  noise?: number
  /** 是否彩色 */
  color?: boolean
  /** 背景色 */
  background?: string
  /** 宽度 */
  width?: number
  /** 高度 */
  height?: number
  /** 字体大小 */
  fontSize?: number
}

/**
 * 验证码生成结果
 */
export interface CaptchaResult {
  /** 验证码文本 */
  text: string
  /** SVG 图片数据 */
  data: string
}

/**
 * 默认验证码配置
 */
const DEFAULT_CAPTCHA_CONFIG: Required<CaptchaConfig> = {
  size: 4,
  type: 'text',
  ignoreChars: '0o1iIl',
  noise: 2,
  color: true,
  background: '#f0f0f0',
  width: 120,
  height: 40,
  fontSize: 50,
}

/**
 * 生成图片验证码
 * @param config 验证码配置
 * @returns 验证码结果
 */
export function generateCaptchaImage(
  config?: Partial<CaptchaConfig>,
): CaptchaResult {
  const finalConfig = { ...DEFAULT_CAPTCHA_CONFIG, ...config }

  // 根据类型生成不同的验证码
  if (finalConfig.type === 'math') {
    const captcha = svgCaptcha.createMathExpr({
      noise: finalConfig.noise,
      color: finalConfig.color,
      background: finalConfig.background,
      width: finalConfig.width,
      height: finalConfig.height,
      fontSize: finalConfig.fontSize,
    })

    return {
      text: captcha.text,
      data: captcha.data,
    }
  } else {
    // 默认生成文本验证码
    const captcha = svgCaptcha.create({
      size: finalConfig.size,
      ignoreChars: finalConfig.ignoreChars,
      noise: finalConfig.noise,
      color: finalConfig.color,
      background: finalConfig.background,
      width: finalConfig.width,
      height: finalConfig.height,
      fontSize: finalConfig.fontSize,
    })

    return {
      text: captcha.text.toLowerCase(),
      data: captcha.data,
    }
  }
}

/**
 * 生成数学运算验证码
 * @returns 验证码结果
 */
export function generateMathCaptcha(): CaptchaResult {
  const captcha = svgCaptcha.createMathExpr({
    noise: 2,
    color: true,
    background: '#f0f0f0',
    width: 120,
    height: 40,
    fontSize: 50,
  })

  return {
    text: captcha.text,
    data: captcha.data,
  }
}

/**
 * 验证验证码文本
 * @param userInput 用户输入
 * @param correctText 正确答案
 * @param caseSensitive 是否区分大小写
 * @returns 是否正确
 */
export function validateCaptchaText(
  userInput: string,
  correctText: string,
  caseSensitive = false,
): boolean {
  if (!userInput || !correctText) {
    return false
  }

  const input = caseSensitive ? userInput : userInput.toLowerCase()
  const correct = caseSensitive ? correctText : correctText.toLowerCase()

  return input === correct
}
