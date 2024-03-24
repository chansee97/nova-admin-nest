import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common/pipes'
import { AppModule } from './app.module'
import { ApiExceptionsFilter, HttpExceptionFilter } from '@/common/filters'
import { TransformInterceptor } from '@/common/interceptor'

async function bootstrap() {
  // 创建服务实例
  const app = await NestFactory.create(AppModule, {})

  app.useGlobalPipes(new ValidationPipe())

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor())

  // 错误过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new ApiExceptionsFilter())

  // 跨域
  app.enableCors()

  // 服务启动
  const configService = app.get(ConfigService)
  const port = configService.get<number>('server.port')
  await app.listen(port)
}
bootstrap()
