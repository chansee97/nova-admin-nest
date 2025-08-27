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
  Put,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger'
import { Permissions } from '@/common/decorators'

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
          sort: 0,
        },
      },
      full: {
        summary: '完整参数',
        description: '创建角色包含所有可选参数',
        value: {
          roleName: '经理',
          roleKey: 'manager',
          sort: 0,
          roleStatus: 1,
          remark: '经理角色',
        },
      },
    },
  })
  @Permissions('system:role:add')
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
  @Permissions('system:role:query')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.roleService.findAll(searchQuery)
  }

  @Get('options')
  @ApiOperation({ summary: '查询所有可选角色' })
  @Permissions('system:role:query')
  findOptions() {
    return this.roleService.findOptions()
  }

  @Get(':id')
  @ApiOperation({ summary: '查询角色详情' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @Permissions('system:role:query')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色信息' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @Permissions('system:role:edit')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @Permissions('system:role:remove')
  remove(@Param('id') id: number) {
    return this.roleService.remove(id)
  }
}
