import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { config as appConfig } from '@/config'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

async function bootstrap() {
  // 创建服务实例
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  // 使用全局 Winston Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('Nova Admin API')
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
      'JWT-auth',
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
  const serverConfig = appConfig.server
  const baseUrl = `http://localhost:${serverConfig.port}`

  // 设置自定义的 JSON 导出路径
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: false,
      displayRequestDuration: true,
      filter: true,
      showExtensions: false,
      showCommonExtensions: false,
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
  const server = appConfig.server

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
