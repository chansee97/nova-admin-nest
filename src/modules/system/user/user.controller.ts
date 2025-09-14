import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import type { SearchQuery } from '@/common/dto'
import { UserService } from './user.service'
import { JwtService } from '@nestjs/jwt'
import { config } from '@/config'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Patch,
  HttpCode,
  Req,
} from '@nestjs/common'
import type { Request } from 'express'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'
import { RequirePermissions, Public } from '@/common/decorators'
import { ApiException } from '@/common/filters'
import { ApiErrorCode } from '@/common/enums'

@ApiTags('用户管理')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({
    type: CreateUserDto,
    description: '用户创建信息',
    examples: {
      basic: {
        summary: '基础用户',
        description: '创建基础用户，仅包含必填信息',
        value: {
          username: 'user001',
          password: '123456',
        },
      },
      withDept: {
        summary: '指定部门用户',
        description: '创建用户并指定所属部门',
        value: {
          username: 'user002',
          password: '123456',
          nickName: '张三',
          deptId: 1,
        },
      },
      full: {
        summary: '完整用户信息',
        description: '创建用户包含所有可选信息',
        value: {
          username: 'admin',
          password: '123456',
          nickName: '系统管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          gender: 'male',
          deptId: 1,
          status: 1,
          remark: '系统管理员账号',
        },
      },
    },
  })
  @Post()
  @HttpCode(200)
  @RequirePermissions('system:user:add')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: '分页查询用户' })
  @RequirePermissions('system:user:list')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.userService.findAll(searchQuery)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询用户详情' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @RequirePermissions('system:user:query')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiBody({
    type: UpdateUserDto,
    description: '用户更新信息',
    examples: {
      basicInfo: {
        summary: '更新基本信息',
        description: '仅更新用户的基本信息',
        value: {
          nickName: '新昵称',
          email: 'new@example.com',
          phone: '13900139000',
        },
      },
      fullUpdate: {
        summary: '完整更新',
        description: '同时更新基本信息、角色和部门',
        value: {
          nickName: '新昵称',
          email: 'new@example.com',
          deptId: 2,
          roleIds: [1, 2],
        },
      },
    },
  })
  @RequirePermissions('system:user:edit')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @RequirePermissions('system:user:remove')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }

  @Patch('password')
  @HttpCode(200)
  @ApiOperation({ summary: '用户更新密码' })
  @ApiBody({
    type: UpdatePasswordDto,
    description: '密码更新信息',
    examples: {
      basic: {
        summary: '更新密码',
        description: '用户更新自己的密码',
        value: {
          oldPassword: '123456',
          newPassword: 'newPassword123',
        },
      },
    },
  })
  async updatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    // 从请求头中提取 token
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new ApiException('未找到访问令牌', ApiErrorCode.SERVER_ERROR)
    }

    // 使用 JwtService 验证并获取用户信息
    try {
      const jwtConfig = config.jwt
      const payload = this.jwtService.verify(token, {
        secret: jwtConfig.secret,
      })

      if (!payload || !payload.userId) {
        throw new ApiException('无效的访问令牌', ApiErrorCode.SERVER_ERROR)
      }

      return this.userService.updatePassword(payload.userId, updatePasswordDto)
    } catch {
      throw new ApiException('访问令牌验证失败', ApiErrorCode.SERVER_ERROR)
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
