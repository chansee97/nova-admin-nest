/**
 * Redis 键的枚举，用于集中管理和避免魔法字符串
 */
export enum RedisKey {
  // 验证码，后跟验证码 ID
  CAPTCHA = 'captcha:',

  // 用户会话信息，后跟用户 ID
  USER_TOKEN = 'user_token:',
}
