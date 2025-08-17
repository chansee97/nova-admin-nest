import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import type { Observable } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { logger } from '@/utils/logger'

export interface Response<T> {
  code: number
  data: T
  message: string
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    /* 打印日志 */
    logger('GLOBAL').info(context.getClass(), context.getHandler())

    return next.handle().pipe(
      map((data: T) => ({
        code: 200,
        data: data || (true as T),
        message: '操作成功',
      })),
    )
  }
}
