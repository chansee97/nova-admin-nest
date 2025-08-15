import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Catch, HttpException, HttpStatus } from '@nestjs/common'
import { logger } from '@/utils/logger'
import { ApiException } from './api-exception'

@Catch(ApiException)
export class ApiExceptionsFilter implements ExceptionFilter {
  catch(exception: ApiException, next: ArgumentsHost) {
    const host = next.switchToHttp()
    const response = host.getResponse<Response>()
    const request = host.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // 输出日志
    logger('API').error(
      `[${request.method}]`,
      `[${request.url}]`,
      exception.getErrorMessage(),
    )

    response.status(status).json({
      code:
        exception instanceof ApiException ? exception.getErrorCode() : status,
      data: null,
      message:
        exception instanceof ApiException
          ? exception.getErrorMessage()
          : exception,
    })
  }
}
