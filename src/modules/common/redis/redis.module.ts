import { Module, Global } from '@nestjs/common'
import { RedisService } from './redis.service'
import { REDIS_CLIENT } from './redis.constants'

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useClass: RedisService,
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
