import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getClientInfo } from '@/utils/client-info'

export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return getClientInfo(request)
  },
)
