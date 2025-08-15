import type { CreateMenuDto } from './dto/create-menu.dto'
import type { UpdateMenuDto } from './dto/update-menu.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { MenuService } from './menu.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'
import { Permissions } from '@/common/decorators'

@ApiTags('Menu')
@ApiBearerAuth('JWT-auth')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('create')
  @ApiOperation({ summary: '创建菜单', description: '创建新的菜单项' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '菜单名称或权限标识符已存在' })
  @Permissions('system:menu:add')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }

  @Get('page')
  @ApiOperation({ summary: '分页查询菜单', description: '分页获取菜单列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('system:menu:query')
  findAll(@Body() searchQuery: SearchQuery) {
    return this.menuService.findAll(searchQuery)
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询菜单详情',
    description: '根据菜单ID查询菜单详细信息',
  })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  @Permissions('system:menu:query')
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(+id)
  }

  @Patch('update')
  @ApiOperation({ summary: '更新菜单信息', description: '更新菜单基本信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  @Permissions('system:menu:edit')
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单', description: '根据菜单ID删除菜单' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  @Permissions('system:menu:remove')
  remove(@Param('id') id: number) {
    return this.menuService.remove(+id)
  }
}
