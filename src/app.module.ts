import { Module, ClassSerializerInterceptor } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { config } from '@/config'
import { AuthModule } from './modules/auth/auth.module'
import { SystemModule } from './modules/system/system.module'
import {
  APP_PIPE,
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_FILTER,
  Reflector,
} from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { JwtGuard, AuthGuard } from '@/common/guards'
import { GlobalInterceptor } from '@/common/interceptors'
import { HttpExceptionFilter, ApiExceptionsFilter } from '@/common/filters'

@Module({
  imports: [
    /* 数据库链接 */
    TypeOrmModule.forRootAsync({
      useFactory: () => config.database,
    }),
    AuthModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [
    // 全局验证管道：自动验证所有进入的请求的数据
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // 全局拦截器：处理日志、超时、响应格式化和错误捕获
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    // 全局序列化拦截器：处理 @Exclude() 和 @Expose() 等装饰器，转换响应对象
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector),
      inject: [Reflector],
    },
    // 全局异常过滤器：捕获并处理所有 HttpException 类型的异常
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 全局业务异常过滤器：处理通过 ApiExceptions 抛出的特定业务逻辑异常
    {
      provide: APP_FILTER,
      useClass: ApiExceptionsFilter,
    },
    // 全局 JWT 认证守卫：验证所有请求的 JWT 令牌
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    // 全局权限守卫：基于角色和权限进行访问控制
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
