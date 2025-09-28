import { Injectable, RequestTimeoutException, Logger } from '@nestjs/common'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, map, tap, timeout } from 'rxjs/operators'
import { config } from '@/config'

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

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${controllerName} -> ${handlerName} -> [${req.method}]${req.url}`,
          'HTTP',
        )
      }),
      timeout(config.server.requestTimeoutMs ?? 30000),
      map((data: T) => ({
        code: 200,
        data: data || (true as T),
        message: '操作成功',
      })),
      catchError((err: any) => {
        const isTimeout = err instanceof TimeoutError

        this.logger.error(
          `${controllerName} -> ${handlerName} -> [${req.method}]${req.url}`,
          err.stack,
          'HTTP',
        )

        if (isTimeout) {
          return throwError(() => new RequestTimeoutException('请求超时'))
        }

        return throwError(() => err)
      }),
    )
  }
}
