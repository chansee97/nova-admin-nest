import 'reflect-metadata'

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
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

  // 全局序列化拦截器 - 处理 @Exclude() 等装饰器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  // 错误过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new ApiExceptionsFilter())

  // 跨域
  app.enableCors()

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('Nove Admin API')
    .setDescription('基于 NestJS + TypeORM 的后台管理系统 API 文档')
    .setVersion(null)
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
    .addTag('认证管理', '用户登录、注册、验证码等认证相关接口')
    .addTag('用户管理', '用户信息的增删改查、角色分配等接口')
    .addTag('角色管理', '角色信息的增删改查、权限分配等接口')
    .addTag('菜单管理', '系统菜单的增删改查、权限配置等接口')
    .addTag('部门管理', '组织架构部门的增删改查等接口')
    .addTag('字典管理', '系统字典类型和字典数据的统一管理接口')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // 获取服务器配置
  const appConfigService = app.get(ConfigService)
  const serverConfig = appConfigService.get('app.server')
  const baseUrl = `http://localhost:${serverConfig.port}`

  // 设置自定义的 JSON 导出路径
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录状态
      displayOperationId: false, // 隐藏操作ID
      displayRequestDuration: true, // 显示请求耗时
      filter: true, // 启用搜索过滤
      showExtensions: false, // 隐藏扩展信息
      showCommonExtensions: false, // 隐藏通用扩展
      // 显示导出链接
      urls: [
        {
          url: `${baseUrl}/api-docs-json`,
          name: 'JSON',
        },
      ],
    },
    customSiteTitle: 'Nova Admin API',
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
