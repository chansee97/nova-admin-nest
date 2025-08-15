import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Catch, HttpException } from '@nestjs/common'
import { isArray } from 'class-validator'
import { logger } from '@/utils/logger'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    // 输出日志
    logger('HTTP').error(
      `[${request.method}]`,
      `[${request.url}]`,
      exception.message,
    )

    const response_data = exception.getResponse()
    let message: string

    if (
      typeof response_data === 'object' &&
      response_data !== null &&
      'message' in response_data
    ) {
      const responseMessage = (response_data as { message: string | string[] })
        .message
      message = isArray(responseMessage) ? responseMessage[0] : responseMessage
    } else {
      message = exception.message
    }

    response.status(status).json({
      code: status,
      data: null,
      message,
    })
  }
}
