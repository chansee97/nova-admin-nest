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

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('create')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }

  @Get('page')
  findAll(@Body() searchQuery: SearchQuery) {
    return this.menuService.findAll(searchQuery)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(+id)
  }

  @Patch('update')
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.menuService.remove(+id)
  }
}
