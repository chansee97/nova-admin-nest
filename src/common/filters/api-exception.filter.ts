import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Catch, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ApiException } from './api-exception'

@Injectable()
@Catch(ApiException)
export class ApiExceptionsFilter implements ExceptionFilter {
  catch(exception: ApiException, next: ArgumentsHost) {
    const host = next.switchToHttp()
    const response = host.getResponse<Response>()
    host.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

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
