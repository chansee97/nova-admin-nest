<div align="center">
  <img src="./nova.icon.svg" width="160"/>
  <h2>nova-admin-nestjs</h2>
</div>

<div align="center">
  <p>基于 NestJS + TypeORM + PostgreSQL 的企业级后台管理系统</p>
  <p>
    <img src="https://img.shields.io/badge/NestJS-11+-red.svg" alt="NestJS">
    <img src="https://img.shields.io/badge/TypeORM-0.3-blue.svg" alt="TypeORM">
    <img src="https://img.shields.io/badge/PostgreSQL-17+-green.svg" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/TypeScript-5.9-blue.svg" alt="TypeScript">
  </p>
</div>

## ✨ 功能特点

- **JWT 认证**: 基于 JSON Web Token 的身份认证
- **RBAC 权限控制**: 用户 → 角色 → 权限的完整权限体系
- **菜单权限**: 动态菜单生成，精确到按钮级别的权限控制
- **接口权限**: 基于装饰器的接口权限验证
- **数据权限**: 支持部门数据权限隔离

## 🏗 系统架构

### 📦 模块结构

```
src/
├── modules/           # 业务模块
│   ├── auth/         # 认证模块
│   ├── user/         # 用户管理
│   ├── role/         # 角色管理
│   ├── menu/         # 菜单管理
│   ├── dept/         # 部门管理
│   └── dict/         # 字典管理
├── common/           # 公共模块
│   ├── decorators/   # 装饰器
│   ├── filters/      # 异常过滤器
│   ├── guards/       # 守卫
│   ├── interceptor/  # 拦截器
│   └── enum/         # 枚举定义
└── utils/            # 工具函数
```

### 🗄 数据库设计

- **sys_user**: 用户表
- **sys_role**: 角色表
- **sys_menu**: 菜单表
- **sys_dept**: 部门表
- **sys_dict_type**: 字典类型表
- **sys_dict_data**: 字典数据表
- **sys_user_role**: 用户角色关联表
- **sys_role_menu**: 角色菜单关联表

## 🌐 前端项目

[Nova Admin](https://github.com/chansee97/nova-admin) - 基于 Vue3 + TypeScript + Element Plus 的前端管理系统

## 📚 API 文档

启动项目后访问：[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🚀 快速开始

### 📋 环境要求

- Node.js >= 22.0.0
- PostgreSQL >= 17.0
- pnpm >= 9.0.0

### 🔧 安装依赖

```bash
pnpm install
```

### ⚙️ 环境配置

修改数据库配置：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=nova_admin

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### 🏃‍♂️ 运行项目

```bash
# 开发环境
npm run start:dev

# 生产环境
npm run start:prod

# 类型检查
npm run type-check
```

## 📖 开发指南

### 🔧 添加新模块

1. 创建模块目录结构：

```bash
src/modules/your-module/
├── entities/          # 实体定义
├── dto/              # 数据传输对象
├── your-module.controller.ts
├── your-module.service.ts
└── your-module.module.ts
```

2. 在 `app.module.ts` 中注册模块

3. 添加相应的权限和菜单配置

### 🎯 权限控制

使用 `@Permissions()` 装饰器控制接口权限：

```typescript
@Get('list')
@Permissions('system:user:query')
findAll() {
  // 需要 system:user:query 权限才能访问
}
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 LICENSE

[LICENSE](LICENSE)

## 🙏 致谢

- [NestJS](https://nestjs.com/) - 渐进式 Node.js 框架
- [TypeORM](https://typeorm.io/) - TypeScript ORM 框架
- [PostgreSQL](https://www.postgresql.org/) - 开源关系型数据库
- [Swagger](https://swagger.io/) - API 文档工具

⭐ 如果这个项目对您有帮助，请给它一个星标！
