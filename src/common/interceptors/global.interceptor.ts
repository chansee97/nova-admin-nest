import {
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, map, tap, timeout } from 'rxjs/operators'

export interface Response<T> {
  code: number
  data: T
  message: string
}

@Injectable()
export class GlobalInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const controllerName = context.getClass().name
    const handlerName = context.getHandler().name

    const http = context.switchToHttp()
    const req = http.getRequest<Request>()
    const res = http.getResponse<any>()

    return next.handle().pipe(
      tap(() => {
        const statusCode = res?.statusCode ?? 200
        const payload = {
          controller: controllerName,
          handler: handlerName,
          method: req.method,
          url: req.url,
          statusCode,
        }
        this.logger.log(JSON.stringify(payload), 'HTTP')
      }),
      timeout(10000),
      map((data: T) => ({
        code: 200,
        data: data || (true as T),
        message: '操作成功',
      })),
      catchError((err: any) => {
        const isTimeout = err instanceof TimeoutError

        this.logger.error(
          `${controllerName} -> ${handlerName} -> [${req.method}]${req.url} \n${err.stack}`,
          null,
          'HTTP',
        )

        if (isTimeout) {
          return throwError(() => new RequestTimeoutException('请求超时'))
        }

        return throwError(
          () =>
            new HttpException(
              '服务器内部错误',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        )
      }),
    )
  }
}
