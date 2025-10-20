<div align="center">
  <img src="./nova.icon.svg" width="160"/>
  <h2>nova-admin-nest</h2>
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
- **验证码**: 内置图形验证码（支持数学、大小写敏感配置）

## 🏗 系统架构

### 📦 模块结构

```
src/
├── modules/           # 业务模块
│   ├── auth/          # 认证模块
│   ├── user/          # 用户管理
│   ├── role/          # 角色管理
│   ├── menu/          # 菜单管理
│   ├── dept/          # 部门管理
│   └── dict/          # 字典管理
├── common/            # 公共模块
│   ├── decorators/    # 装饰器
│   ├── filters/       # 异常过滤器
│   ├── guards/        # 守卫
│   ├── interceptors/  # 拦截器
│   └── enums/         # 枚举定义
└── utils/             # 工具函数
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
- **sys_role_dept**: 角色部门关联表（数据权限）

### 📐 数据库规范

- **命名风格**: 列名、索引名、外键名统一蛇形命名（snake_case），由自定义 `SnakeCaseNamingStrategy` 自动转换
  - 索引名：`idx_<table>_<columns>`，如 `idx_sys_user_username`
  - 唯一约束：`uk_<table>_<columns>`
  - 外键名：`fk_<table>_<column>`
  - 主键名：`pk_<table>`
- **主键策略**: 各表主键 `id` 使用自增整型（`@PrimaryGeneratedColumn`）
- **审计字段**: 统一包含 `create_time`、`update_time`，由 `@CreateDateColumn`、`@UpdateDateColumn` 自动维护，并通过 `@DateFormat()` 统一格式化输出
- **关系约定**:
  - 外键列显式命名（如用户表 `dept_id`），并建立必要索引
- **类型与长度**:
  - 文本字段明确长度限制（如账号 30、邮件 50、权限标识 100 等）
  - 枚举类型使用数据库枚举（如性别、菜单类型）
- **字段默认值**:
  - 时间：`create_time`、`update_time` 由数据库默认 `now()`/`CURRENT_TIMESTAMP` 或 ORM 自动维护
  - 字符串：非必填字符串统一默认空字符串 `''`（如 `remark`、`avatar`、`nick_name` 等）
  - 数值：业务状态类字段采用明确默认值（如 `status` 默认为 `0`）
  - 布尔：显式给出默认（如 `menu_visible`、`tab_visible` 默认为 `true`；`pin_tab`、`is_link`、`keep_alive` 默认为 `false`）
  - 枚举：提供安全的默认项（如性别 `unknown`、菜单类型 `directory`）
  - 外键：可空外键（如 `dept_id`）默认 `NULL`，并使用 `ON DELETE SET NULL` 或在业务层保护
- **迁移与同步**:
  - 开发环境允许 `synchronize: true`；生产环境建议关闭并使用迁移工具

## 🌐 前端项目

[Nova Admin](https://github.com/chansee97/nova-admin) - 基于 Vue3 + TypeScript + Naive UI 的前端管理系统

## 📚 API 文档

启动项目后访问：[`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)

在线文档：[Nova Nest](https://nova-nest.apifox.cn)

## 🚀 快速开始

### 📋 环境要求

- Node.js >= 22.0.0
- PostgreSQL >= 17.0
- pnpm >= 9.0.0

### 🔧 安装依赖

```bash
pnpm install
```

### ⚙️ 配置说明

本项目通过代码化配置区分环境，而非使用 `.env` 文件。根据 `NODE_ENV` 读取以下文件：

- 开发环境：`src/config/env/dev.ts`
- 生产环境：`src/config/env/prod.ts`

默认开发环境数据库配置（可在 `dev.ts` 中修改）：

```ts
// src/config/env/dev.ts
export default {
  server: { port: 3000 },
  database: {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'root',
    password: 'postgres',
    database: 'nova_db',
    synchronize: true,
    autoLoadEntities: true,
  },
  jwt: {
    secret: 'secret-key',
    expiresIn: '7d',
  },
}
```

> 提示：`synchronize: true` 仅建议在开发环境使用，生产环境请改为 `false` 并使用迁移。

如需初始化表结构或示例数据，可参考根目录的 `example.sql`。

### 🏃‍♂️ 运行项目

```bash
# 开发环境（会自动设置 NODE_ENV=dev）
pnpm start:dev

# 生产环境构建与运行（会自动设置 NODE_ENV=prod）
pnpm build
pnpm start:prod

# 类型检查
pnpm run type-check

# 代码风格（ESLint & Prettier）
pnpm run lint
pnpm run format
```

### 🎯 权限控制

项目提供统一的权限装饰器（从 `src/common/decorators` 导入）：

- `Public()`：标记公开接口，跳过认证与权限校验
- `RequirePermissions(...permissions: string[])`：仅校验权限标识
- `RequireRoles(...roles: string[])`：仅校验角色标识
- `RequireAuth(permissions: string[], roles: string[])`：同时校验权限与角色

示例：

```ts
import { Controller, Get } from '@nestjs/common'
import {
  Public,
  RequirePermissions,
  RequireRoles,
  RequireAuth,
} from '@/common/decorators'

@Controller('user')
export class UserController {
  // 公开接口（无需登录）
  @Get('captcha')
  @Public()
  getCaptcha() {
    return 'ok'
  }

  // 仅权限校验
  @Get('list')
  @RequirePermissions('system:user:query')
  findAll() {
    return []
  }

  // 仅角色校验
  @Get('admin-only')
  @RequireRoles('admin')
  adminOnly() {
    return 'admin'
  }

  // 同时校验权限与角色
  @Get('assign')
  @RequireAuth(['system:user:assign'], ['admin'])
  assign() {
    return 'ok'
  }
}
```

### 📊 数据范围权限

项目支持基于部门的数据范围权限控制，实现不同角色对数据的访问隔离。

#### 数据范围类型

系统支持以下几种数据范围：

- **全部数据权限**：可以访问所有数据
- **自定数据权限**：只能访问指定部门及其子部门的数据
- **部门数据权限**：只能访问本部门的数据
- **部门及以下数据权限**：可以访问本部门及其子部门的数据
- **仅本人数据权限**：只能访问自己创建的数据

#### 配置方式

1. **角色配置**：在角色管理中为角色分配数据范围类型
2. **部门关联**：通过 `sys_role_dept` 表关联角色与可访问的部门

#### 使用示例

在需要数据权限控制的 Service 中使用：

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { Dept } from './entities/dept.entity'
import { DataScopeService } from '@/modules/auth/data-scope.service'
import { Session } from '@/types/session'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataScopeService: DataScopeService,
  ) {}

  // 用户列表查询 - 应用数据范围过滤
  async findAll(baseWhere: any = {}, session: Session) {
    const whereCondition = await this.dataScopeService.applyForUserList(
      baseWhere,
      session,
    )

    return this.userRepository.find({
      where: whereCondition,
      relations: ['dept', 'roles'],
    })
  }
}

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private deptRepository: Repository<Dept>,
    private dataScopeService: DataScopeService,
  ) {}

  // 部门列表查询 - 应用数据范围过滤
  async findAll(baseWhere: any = {}, session: Session) {
    const whereCondition = await this.dataScopeService.applyForDeptList(
      baseWhere,
      session,
    )

    return this.deptRepository.find({
      where: whereCondition,
      order: { orderNum: 'ASC' },
    })
  }
}
```

#### Controller 中的使用

```ts
import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  async findAll(@Req() req: Request) {
    const session = req.session as Session
    return this.userService.findAll({}, session)
  }
}
```

#### 新业务模块数据范围支持

如果要开发支持数据范围筛选的新业务模块，业务表需要预留以下字段：

```sql
-- 业务表示例（如：项目表、订单表等）
CREATE TABLE business_table (
  id INTEGER PRIMARY KEY,

  -- 必需字段：支持数据范围筛选
  create_user_id INTEGER,              -- 创建用户ID（支持"仅本人数据权限"）
  dept_id INTEGER,                     -- 所属部门ID（支持部门级数据权限）

  -- 业务字段
  name VARCHAR(100),
  status SMALLINT DEFAULT 0,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- 其他业务字段...

  -- 外键约束
  FOREIGN KEY (create_user_id) REFERENCES sys_user(id),
  FOREIGN KEY (dept_id) REFERENCES sys_dept(id)
);
```

**字段说明**：

- `create_user_id`：创建者用户ID，用于"仅本人数据权限"过滤
- `dept_id`：所属部门ID，用于部门级数据权限过滤

**使用方式**：

```ts
// 在业务 Service 中应用数据范围
async findBusinessData(baseWhere: any = {}, session: Session) {
  // 方式1：通过用户关联查询（适用于有创建者的业务数据）
  const userWhereCondition = await this.dataScopeService.applyForUserList(
    {},
    session
  )

  // 先查询允许访问的用户ID列表
  const allowedUsers = await this.userRepository.find({
    where: userWhereCondition,
    select: ['id']
  })
  const allowedUserIds = allowedUsers.map(user => user.id)

  // 方式2：通过部门关联查询（推荐）
  const deptWhereCondition = await this.dataScopeService.applyForDeptList(
    {},
    session
  )

  const allowedDepts = await this.deptRepository.find({
    where: deptWhereCondition,
    select: ['id']
  })
  const allowedDeptIds = allowedDepts.map(dept => dept.id)

  // 最终业务数据查询
  return this.businessRepository.find({
    where: [
      { ...baseWhere, createUserId: In(allowedUserIds) },  // 创建者筛选
      { ...baseWhere, deptId: In(allowedDeptIds) }         // 部门筛选
    ]
  })
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
