import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import type { SearchQuery } from '@/common/dto'
import { RoleService } from './role.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  HttpCode,
  Patch,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger'
import { RequirePermissions } from '@/common/decorators'

@ApiTags('角色管理')
@ApiBearerAuth('JWT-auth')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '创建角色' })
  @ApiBody({
    type: CreateRoleDto,
    description: '角色创建信息',
    examples: {
      minimal: {
        summary: '最小参数',
        description: '创建角色所需的最少参数',
        value: {
          roleName: '管理员',
          roleKey: 'admin',
        },
      },
      full: {
        summary: '完整参数',
        description: '创建角色包含所有可选参数',
        value: {
          roleName: '经理',
          roleKey: 'manager',
          status: 1,
          remark: '经理角色',
        },
      },
    },
  })
  @RequirePermissions('system:role:add')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get()
  @ApiOperation({ summary: '分页查询角色' })
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
  @ApiQuery({
    name: 'roleName',
    required: false,
    description: '角色名称',
    example: '管理员',
  })
  @ApiQuery({
    name: 'roleKey',
    required: false,
    description: '角色权限字符串',
    example: 'admin',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '角色状态（0正常 1停用）',
    example: 0,
  })
  @RequirePermissions('system:role:list')
  findAll(
    @Query()
    searchQuery: SearchQuery & {
      roleName?: string
      roleKey?: string
      status?: number
    },
  ) {
    return this.roleService.findAll(searchQuery)
  }

  @Get('options')
  @ApiOperation({ summary: '角色下拉选项' })
  findOptions() {
    return this.roleService.findOptions()
  }

  @Get(':id')
  @ApiOperation({ summary: '查询角色详情' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @RequirePermissions('system:role:query')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新角色信息' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @RequirePermissions('system:role:edit')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @RequirePermissions('system:role:remove')
  remove(@Param('id') id: number) {
    return this.roleService.remove(id)
  }
}
