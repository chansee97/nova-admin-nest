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
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { SetMenusDto } from './dto/set-menus.dto'
import { SetPermissionsDto } from './dto/set-permisssions.dto'
import { SearchQuery } from '@/common/dto'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get('page')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.roleService.findAll(searchQuery)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id)
  }

  @Patch('update')
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto)
  }

  @Post('setPremissions')
  setPremissions(@Body() setPermissionsDto: SetPermissionsDto) {
    return this.roleService.setPermissions(setPermissionsDto)
  }

  @Post('setMenus')
  setMenus(@Body() setMenusDto: SetMenusDto) {
    return this.roleService.setMenus(setMenusDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.remove(id)
  }
}
