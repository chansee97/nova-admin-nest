/**
 * JWT utility functions
 */

/**
 * 将 JWT 过期时间字符串转换为秒数
 * 支持的格式: '7d', '24h', '60m', '3600s' 或纯数字字符串
 *
 * @param expiresInString - JWT 过期时间字符串
 * @returns 过期时间的秒数
 *
 * @example
 * ```typescript
 * convertExpiresInToSeconds('7d')   // 604800 (7 * 24 * 3600)
 * convertExpiresInToSeconds('24h')  // 86400 (24 * 3600)
 * convertExpiresInToSeconds('60m')  // 3600 (60 * 60)
 * convertExpiresInToSeconds('3600') // 3600
 * ```
 */
export function convertExpiresInToSeconds(expiresInString: string): number {
  const unit = expiresInString.slice(-1)
  const value = parseInt(expiresInString.slice(0, -1), 10)

  // 如果解析数字失败，尝试将整个字符串作为数字解析
  if (isNaN(value)) {
    const directValue = parseInt(expiresInString, 10)
    if (isNaN(directValue)) {
      throw new Error(`Invalid expires in format: ${expiresInString}`)
    }
    return directValue
  }

  // 根据单位转换为秒数
  switch (unit) {
    case 'd': // 天
      return value * 24 * 3600
    case 'h': // 小时
      return value * 3600
    case 'm': // 分钟
      return value * 60
    case 's': // 秒
      return value
    default:
      // 如果没有单位标识符，将整个字符串作为秒数处理
      return parseInt(expiresInString, 10)
  }
}
