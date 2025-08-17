import type { CreateUserDto } from './dto/create-user.dto'
import type { SetRoleDto } from './dto/set-roles.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { SearchQuery } from '@/common/dto'
import { UserService } from './user.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { Permissions, Public } from '@/common/decorators'

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: '用户注册', description: '注册新用户账号' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '用户名已存在或参数错误' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get('page')
  @ApiOperation({ summary: '分页查询用户', description: '分页获取用户列表' })
  @ApiQuery({
    name: 'pageNum',
    required: false,
    description: '页码',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: '每页数量',
    example: 10,
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('system:user:query')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.userService.findAll(searchQuery)
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询用户详情',
    description: '根据用户ID查询用户详细信息',
  })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Permissions('system:user:query')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch('update')
  @ApiOperation({ summary: '更新用户信息', description: '更新用户基本信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Permissions('system:user:edit')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }

  @Post('setRole')
  @ApiOperation({ summary: '设置用户角色', description: '为用户分配角色' })
  @ApiResponse({ status: 200, description: '设置成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Permissions('system:user:edit')
  setRole(@Body() setRoleDto: SetRoleDto) {
    return this.userService.setRole(setRoleDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除用户',
    description: '根据用户ID删除用户（软删除）',
  })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Permissions('system:user:remove')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
