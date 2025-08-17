import type { CreateDictTypeDto } from './dto/create-dict-type.dto'
import type { UpdateDictTypeDto } from './dto/update-dict-type.dto'
import type { SearchQuery } from '@/common/dto'
import { DictTypeService } from './dict-type.service'
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

@ApiTags('Dict')
@ApiBearerAuth('JWT-auth')
@Controller('dict/type')
export class DictTypeController {
  constructor(private readonly dictTypeService: DictTypeService) {}

  @Post('create')
  @ApiOperation({ summary: '创建字典类型', description: '创建新的字典类型' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '字典类型已存在' })
  @Permissions('system:dict:add')
  create(@Body() createDictTypeDto: CreateDictTypeDto) {
    return this.dictTypeService.create(createDictTypeDto)
  }

  @Get('page')
  @ApiOperation({
    summary: '分页查询字典类型',
    description: '分页获取字典类型列表',
  })
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
  @Permissions('system:dict:query')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.dictTypeService.findAll(searchQuery)
  }

  @Get('options')
  @ApiOperation({
    summary: '获取字典类型选项',
    description: '获取字典类型下拉选项',
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('system:dict:query')
  getOptions() {
    return this.dictTypeService.getOptions()
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询字典类型详情',
    description: '根据字典ID查询字典类型详细信息',
  })
  @ApiParam({ name: 'id', description: '字典ID', example: 1 })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @Permissions('system:dict:query')
  findOne(@Param('id') id: string) {
    return this.dictTypeService.findOne(+id)
  }

  @Get('type/:dictType')
  @ApiOperation({
    summary: '根据字典类型查询',
    description: '根据字典类型查询字典数据',
  })
  @ApiParam({
    name: 'dictType',
    description: '字典类型',
    example: 'sys_user_sex',
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @Permissions('system:dict:query')
  findByType(@Param('dictType') dictType: string) {
    return this.dictTypeService.findByType(dictType)
  }

  @Patch('update')
  @ApiOperation({ summary: '更新字典类型', description: '更新字典类型信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @Permissions('system:dict:edit')
  update(@Body() updateDictTypeDto: UpdateDictTypeDto) {
    return this.dictTypeService.update(updateDictTypeDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除字典类型',
    description: '根据字典ID删除字典类型（软删除）',
  })
  @ApiParam({ name: 'id', description: '字典ID', example: 1 })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 400, description: '存在字典数据，无法删除' })
  @Permissions('system:dict:remove')
  remove(@Param('id') id: string) {
    return this.dictTypeService.remove(+id)
  }
}
