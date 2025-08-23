import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { DictTypeService } from './dict-type.service'
import { DictDataService } from './dict-data.service'
import { CreateDictTypeDto } from './dto/create-dict-type.dto'
import { UpdateDictTypeDto } from './dto/update-dict-type.dto'
import { CreateDictDataDto } from './dto/create-dict-data.dto'
import { UpdateDictDataDto } from './dto/update-dict-data.dto'

@ApiTags('字典管理')
@ApiBearerAuth()
@Controller('dict')
export class DictController {
  constructor(
    private readonly dictTypeService: DictTypeService,
    private readonly dictDataService: DictDataService,
  ) {}

  // ==================== 字典类型管理 ====================

  @Post('type/create')
  @HttpCode(200)
  @ApiOperation({ summary: '字典类型-创建', description: '创建新的字典类型' })
  @ApiResponse({ status: 200, description: '创建成功' })
  createDictType(@Body() createDictTypeDto: CreateDictTypeDto) {
    return this.dictTypeService.create(createDictTypeDto)
  }

  @Get('type/page')
  @ApiOperation({ summary: '字典类型-列表', description: '获取字典类型列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findDictTypePage() {
    return this.dictTypeService.findAll({})
  }

  @Get('type/:id')
  @ApiOperation({
    summary: '字典类型-详情',
    description: '根据ID获取字典类型详情',
  })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findDictTypeById(@Param('id') id: string) {
    return this.dictTypeService.findOne(+id)
  }

  @Patch('type/update')
  @HttpCode(200)
  @ApiOperation({ summary: '字典类型-更新', description: '更新字典类型信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  updateDictType(@Body() updateDictTypeDto: UpdateDictTypeDto) {
    return this.dictTypeService.update(updateDictTypeDto)
  }

  @Delete('type/:id')
  @ApiOperation({ summary: '字典类型-删除', description: '删除指定的字典类型' })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  removeDictType(@Param('id') id: string) {
    return this.dictTypeService.remove(+id)
  }

  // ==================== 字典数据管理 ====================

  @Post('data/create')
  @HttpCode(200)
  @ApiOperation({ summary: '字典数据-创建', description: '创建新的字典数据' })
  @ApiResponse({ status: 200, description: '创建成功' })
  createDictData(@Body() createDictDataDto: CreateDictDataDto) {
    return this.dictDataService.create(createDictDataDto)
  }

  @Get('data/page')
  @ApiOperation({ summary: '字典数据-列表', description: '获取字典数据列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findDictDataPage() {
    return this.dictDataService.findAll({})
  }

  @Get('data/type/:dictType')
  @ApiOperation({
    summary: '字典数据-按类型查询',
    description: '根据字典类型获取对应的字典数据列表',
  })
  @ApiParam({ name: 'dictType', description: '字典类型' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findDictDataByType(@Param('dictType') dictType: string) {
    return this.dictDataService.findByType(dictType)
  }

  @Get('data/:id')
  @ApiOperation({
    summary: '字典数据-详情',
    description: '根据ID获取字典数据详情',
  })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findDictDataById(@Param('id') id: string) {
    return this.dictDataService.findOne(+id)
  }

  @Patch('data/update')
  @HttpCode(200)
  @ApiOperation({ summary: '字典数据-更新', description: '更新字典数据信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  updateDictData(@Body() updateDictDataDto: UpdateDictDataDto) {
    return this.dictDataService.update(updateDictDataDto)
  }

  @Delete('data/:id')
  @ApiOperation({ summary: '字典数据-删除', description: '删除指定的字典数据' })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  removeDictData(@Param('id') id: string) {
    return this.dictDataService.remove(+id)
  }

  @Post('data/refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: '字典数据-刷新缓存',
    description: '刷新字典数据缓存',
  })
  @ApiResponse({ status: 200, description: '刷新成功' })
  refreshDictCache() {
    return this.dictDataService.refreshCache()
  }
}
