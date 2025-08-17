import { ApiProperty } from '@nestjs/swagger'

/**
 * 验证码响应 DTO
 */
export class CaptchaResponseDto {
  @ApiProperty({
    description: '验证码ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  captchaId: string

  @ApiProperty({
    description: '验证码图片（SVG格式）',
    example:
      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40">...</svg>',
  })
  captchaImage: string

  @ApiProperty({
    description: '是否启用验证码',
    example: true,
  })
  enabled: boolean
}
