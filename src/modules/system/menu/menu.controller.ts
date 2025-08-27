import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

import { MenuService } from './menu.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'
import { Permissions } from '@/common/decorators'

@ApiTags('菜单管理')
@ApiBearerAuth('JWT-auth')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '创建菜单' })
  @ApiBody({
    type: CreateMenuDto,
    description: '创建菜单信息',
  })
  @Permissions('system:menu:add')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }

  @Get()
  @ApiOperation({ summary: '查询所有菜单' })
  @Permissions('system:menu:query')
  findAll() {
    return this.menuService.findAll()
  }

  @Get('options')
  @ApiOperation({ summary: '获取菜单下拉树形结构' })
  @Permissions('system:menu:query')
  selectTree() {
    return this.menuService.findOptions()
  }

  @Get(':id')
  @ApiOperation({ summary: '查询菜单详情' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @Permissions('system:menu:query')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单信息' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @ApiBody({
    type: CreateMenuDto,
    description: '更新菜单信息',
  })
  @Permissions('system:menu:edit')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @Permissions('system:menu:remove')
  remove(@Param('id') id: number) {
    return this.menuService.remove(+id)
  }
}
