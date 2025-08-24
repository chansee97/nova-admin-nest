import type { CreateMenuDto } from './dto/create-menu.dto'
import type { UpdateMenuDto } from './dto/update-menu.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { MenuService } from './menu.service'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger'
import { Permissions } from '@/common/decorators'

@ApiTags('菜单管理')
@ApiBearerAuth('JWT-auth')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @Permissions('system:menu:add')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }

  @Get()
  @ApiOperation({ summary: '分页查询菜单' })
  @Permissions('system:menu:query')
  findAll(@Body() searchQuery: SearchQuery) {
    return this.menuService.findAll(searchQuery)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询菜单详情' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @Permissions('system:menu:query')
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(+id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单信息' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @Permissions('system:menu:edit')
  update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @Permissions('system:menu:remove')
  remove(@Param('id') id: number) {
    return this.menuService.remove(+id)
  }
}
