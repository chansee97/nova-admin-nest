import {
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, map, tap, timeout } from 'rxjs/operators'
import { logger } from '@/utils/logger'

export interface Response<T> {
  code: number
  data: T
  message: string
}

@Injectable()
export class GlobalInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      /* 打印请求日志 */
      tap(() => {
        logger('GLOBAL').info(
          `Request: ${context.getClass().name} -> ${context.getHandler().name}`,
        )
      }),
      /* 设置30秒超时 */
      timeout(30000),
      /* 转换成功响应数据 */
      map((data: T) => ({
        code: 200,
        data: data || (true as T),
        message: '操作成功',
      })),
      /* 捕获并处理错误 */
      catchError((err: any) => {
        // 记录错误日志
        logger('GLOBAL-ERROR').error(
          `[${context.getClass().name}] -> [${context.getHandler().name}]`,
          err.stack,
        )

        // 处理超时错误
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('请求超时'))
        }

        // 处理其他 HttpException
        if (err instanceof HttpException) {
          return throwError(() => err)
        }

        // 处理未知错误
        return throwError(
          () =>
            new HttpException(
              err.message || '服务器内部错误',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        )
      }),
    )
  }
}
