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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger'
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

  @Post('types')
  @HttpCode(200)
  @ApiOperation({ summary: '字典类型-创建' })
  createDictType(@Body() createDictTypeDto: CreateDictTypeDto) {
    return this.dictTypeService.create(createDictTypeDto)
  }

  @Get('types')
  @ApiOperation({ summary: '字典类型-列表' })
  findDictTypePage() {
    return this.dictTypeService.findAll({})
  }

  @Get('types/:id')
  @ApiOperation({ summary: '字典类型-详情' })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  findDictTypeById(@Param('id') id: string) {
    return this.dictTypeService.findOne(+id)
  }

  @Put('types/:id')
  @HttpCode(200)
  @ApiOperation({ summary: '字典类型-更新' })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  updateDictType(
    @Param('id') id: string,
    @Body() updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.dictTypeService.update(+id, updateDictTypeDto)
  }

  @Delete('types/:id')
  @ApiOperation({ summary: '字典类型-删除' })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  removeDictType(@Param('id') id: string) {
    return this.dictTypeService.remove(+id)
  }

  // ==================== 字典数据管理 ====================

  @Post('data')
  @HttpCode(200)
  @ApiOperation({ summary: '字典数据-创建' })
  createDictData(@Body() createDictDataDto: CreateDictDataDto) {
    return this.dictDataService.create(createDictDataDto)
  }

  @Get('data')
  @ApiOperation({ summary: '字典数据-列表' })
  findDictDataPage() {
    return this.dictDataService.findAll({})
  }

  @Get('data/:id')
  @ApiOperation({ summary: '字典数据-详情' })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  findDictDataById(@Param('id') id: string) {
    return this.dictDataService.findOne(+id)
  }

  @Put('data/:id')
  @HttpCode(200)
  @ApiOperation({ summary: '字典数据-更新' })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  updateDictData(
    @Param('id') id: string,
    @Body() updateDictDataDto: UpdateDictDataDto,
  ) {
    return this.dictDataService.update(+id, updateDictDataDto)
  }

  @Delete('data/:id')
  @ApiOperation({ summary: '字典数据-删除' })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  removeDictData(@Param('id') id: string) {
    return this.dictDataService.remove(+id)
  }

  @Get('data/type/:dictType')
  @ApiOperation({ summary: '字典数据-按类型查询' })
  @ApiParam({ name: 'dictType', description: '字典类型' })
  findDictDataByType(@Param('dictType') dictType: string) {
    return this.dictDataService.findByType(dictType)
  }

  @Post('data/refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: '字典数据-刷新缓存',
    description: '刷新字典数据缓存',
  })
  refreshDictCache() {
    return this.dictDataService.refreshCache()
  }
}
