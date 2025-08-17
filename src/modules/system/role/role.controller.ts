import type { CreateRoleDto } from './dto/create-role.dto'
import type { SetMenusDto } from './dto/set-menus.dto'
import type { UpdateRoleDto } from './dto/update-role.dto'
import type { SearchQuery } from '@/common/dto'
import { RoleService } from './role.service'
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
import { Permissions } from '@/common/decorators'

@ApiTags('Role')
@ApiBearerAuth('JWT-auth')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @ApiOperation({ summary: '创建角色', description: '创建新的角色' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '角色名称或编码已存在' })
  @Permissions('system:role:add')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get('page')
  @ApiOperation({ summary: '分页查询角色', description: '分页获取角色列表' })
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
  @Permissions('system:role:query')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.roleService.findAll(searchQuery)
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询角色详情',
    description: '根据角色ID查询角色详细信息',
  })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @Permissions('system:role:query')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id)
  }

  @Patch('update')
  @ApiOperation({ summary: '更新角色信息', description: '更新角色基本信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @Permissions('system:role:edit')
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto)
  }

  @Post('setMenus')
  @ApiOperation({
    summary: '设置角色菜单权限',
    description: '为角色分配菜单权限',
  })
  @ApiResponse({ status: 200, description: '设置成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @Permissions('system:role:edit')
  setMenus(@Body() setMenusDto: SetMenusDto) {
    return this.roleService.setMenus(setMenusDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色', description: '根据角色ID删除角色' })
  @ApiParam({ name: 'id', description: '角色ID', example: 1 })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @Permissions('system:role:remove')
  remove(@Param('id') id: number) {
    return this.roleService.remove(id)
  }
}
