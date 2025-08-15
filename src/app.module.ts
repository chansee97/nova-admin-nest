import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import configuration from './config/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { MenuModule } from './modules/menu/menu.module'
import { PermissionModule } from './modules/permission/permission.module'
import { RoleModule } from './modules/role/role.module'
/* 业务模块 */
import { UserModule } from './modules/user/user.module'
/* 辅助工具 */
import { getEnvFilePath } from './utils/env'

@Module({
  imports: [
    /* 全局环境变量 */
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [configuration],
      isGlobal: true,
    }),
    /* 数据库链接 */
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<string>('database.type') as any,
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          synchronize: true, // 是否自动同步实体文件,生产环境建议关闭
          autoLoadEntities: true, // 自动加载实体
          logging: true, // 启用日志以便调试
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    MenuModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
