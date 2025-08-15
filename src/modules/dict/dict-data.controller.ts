import type { CreateDictDataDto } from './dto/create-dict-data.dto'
import type { UpdateDictDataDto } from './dto/update-dict-data.dto'
import type { SearchQuery } from '@/common/dto'
import { DictDataService } from './dict-data.service'
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
@Controller('dict/data')
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Post('create')
  @ApiOperation({ summary: '创建字典数据', description: '创建新的字典数据' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '字典键值已存在或字典类型不存在' })
  @Permissions('system:dict:add')
  create(@Body() createDictDataDto: CreateDictDataDto) {
    return this.dictDataService.create(createDictDataDto)
  }

  @Get('page')
  @ApiOperation({
    summary: '分页查询字典数据',
    description: '分页获取字典数据列表',
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
  @ApiQuery({
    name: 'dictType',
    required: false,
    description: '字典类型',
    example: 'sys_user_sex',
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('system:dict:query')
  findAll(@Query() searchQuery: SearchQuery & { dictType?: string }) {
    return this.dictDataService.findAll(searchQuery)
  }

  @Get('type/:dictType')
  @ApiOperation({
    summary: '根据字典类型查询数据',
    description: '根据字典类型查询字典数据选项',
  })
  @ApiParam({
    name: 'dictType',
    description: '字典类型',
    example: 'sys_user_sex',
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('system:dict:query')
  findByType(@Param('dictType') dictType: string) {
    return this.dictDataService.findByType(dictType)
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询字典数据详情',
    description: '根据字典编码查询字典数据详细信息',
  })
  @ApiParam({ name: 'id', description: '字典编码', example: 1 })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '字典数据不存在' })
  @Permissions('system:dict:query')
  findOne(@Param('id') id: string) {
    return this.dictDataService.findOne(+id)
  }

  @Patch('update')
  @ApiOperation({ summary: '更新字典数据', description: '更新字典数据信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '字典数据不存在' })
  @Permissions('system:dict:edit')
  update(@Body() updateDictDataDto: UpdateDictDataDto) {
    return this.dictDataService.update(updateDictDataDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除字典数据',
    description: '根据字典编码删除字典数据（软删除）',
  })
  @ApiParam({ name: 'id', description: '字典编码', example: 1 })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '字典数据不存在' })
  @Permissions('system:dict:remove')
  remove(@Param('id') id: string) {
    return this.dictDataService.remove(+id)
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新字典缓存', description: '刷新字典数据缓存' })
  @ApiResponse({ status: 200, description: '刷新成功' })
  @Permissions('system:dict:edit')
  refreshCache() {
    return this.dictDataService.refreshCache()
  }
}
