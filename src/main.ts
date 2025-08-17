import 'reflect-metadata'

import { ValidationPipe } from '@nestjs/common/pipes'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ApiExceptionsFilter, HttpExceptionFilter } from '@/common/filters'
import { TransformInterceptor } from '@/common/interceptors'
import { AppModule } from './app.module'

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

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('Nove Admin API')
    .setDescription('基于 NestJS + TypeORM 的后台管理系统 API 文档')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('Auth', '认证相关接口')
    .addTag('User', '用户管理接口')
    .addTag('Role', '角色管理接口')
    .addTag('Menu', '菜单管理接口')
    .addTag('Dept', '部门管理接口')
    .addTag('Dict', '字典管理接口')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录状态
    },
  })

  // 服务启动
  const configService = app.get(ConfigService)
  const server = configService.get('app.server')

  await app.listen(server.port)
  console.log(`🚀 Application is running on: http://localhost:${server.port}`)
  console.log(
    `📚 Swagger documentation: http://localhost:${server.port}/api-docs`,
  )
}
bootstrap().catch(error => {
  console.error('Application failed to start:', error)
  process.exit(1)
})
