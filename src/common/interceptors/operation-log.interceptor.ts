import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { OperLogService } from '@/modules/monitor/oper-log/oper-log.service'
import { OperLog } from '@/modules/monitor/oper-log/entities/oper-log.entity'
import { LOG_KEY } from '@/common/decorators/log.decorator'
import { getClientInfo } from '@/utils/client-info'

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly operLogService: OperLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check for logging enabled at handler-level or class-level
    const handlerLogEnabled = this.reflector.get<boolean>(
      LOG_KEY,
      context.getHandler(),
    )
    const classLogEnabled = this.reflector.get<boolean>(
      LOG_KEY,
      context.getClass(),
    )

    if (!handlerLogEnabled && !classLogEnabled) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const { method, originalUrl, body, params, query, user } = request

    const operLog = new OperLog()

    const { browser, os, ipaddr, loginLocation } = getClientInfo(request)

    operLog.browser = browser
    operLog.os = os
    // Get title from @ApiOperation
    const apiOperation = this.reflector.get<{ summary: string }>(
      'swagger/apiOperation',
      context.getHandler(),
    )
    operLog.title = apiOperation?.summary || ''

    operLog.method = `${context.getClass().name}.${context.getHandler().name}`
    operLog.requestMethod = method
    operLog.operUrl = originalUrl
    operLog.operIp = ipaddr
    operLog.operLocation = loginLocation

    if (user) {
      operLog.operName = user.username
      operLog.deptName = user.dept?.deptName || ''
    }

    const requestParams = { ...body, ...params, ...query }
    if (Object.keys(requestParams).length > 0) {
      operLog.operParam = JSON.stringify(requestParams)
    }

    const startTime = performance.now()

    return next.handle().pipe(
      tap(data => {
        const costTime = performance.now() - startTime
        operLog.costTime = `${costTime.toFixed(2)}ms`
        operLog.status = 0 // Success
        operLog.jsonResult = data.message
        void this.operLogService.create(operLog)
      }),
      catchError(err => {
        const costTime = performance.now() - startTime
        operLog.costTime = `${costTime.toFixed(2)}ms`
        operLog.status = 1 // Error
        operLog.errorMsg = err.message
        void this.operLogService.create(operLog)
        return throwError(() => err)
      }),
    )
  }
}
