import type { CreatePermissionDto } from './dto/create-permission.dto'
import type { UpdatePermissionDto } from './dto/update-permission.dto'
import type { PermissionService } from './permission.service'
import type { SearchQuery } from '@/common/dto'
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

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto)
  }

  @Get('page')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.permissionService.findAll(searchQuery)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id)
  }

  @Patch('update')
  update(@Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(updatePermissionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id)
  }
}
