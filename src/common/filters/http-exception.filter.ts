import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Catch, HttpException, Injectable } from '@nestjs/common'
import { isArray } from 'class-validator'

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    ctx.getRequest<Request>()
    const status = exception.getStatus()

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
