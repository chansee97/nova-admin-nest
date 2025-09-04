import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { RequirePermissions } from '@/common/decorators'
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
  @RequirePermissions('system:dict:add')
  createDictType(@Body() createDictTypeDto: CreateDictTypeDto) {
    return this.dictTypeService.create(createDictTypeDto)
  }

  @Get('types')
  @ApiOperation({ summary: '字典类型-列表' })
  @RequirePermissions('system:dict:list')
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
    name: 'name',
    required: false,
    description: '字典名称',
    example: '用户性别',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: '字典类型',
    example: 'sys_user_sex',
  })
  findDictTypePage(
    @Query()
    query: {
      pageNum?: number
      pageSize?: number
      name?: string
      type?: string
    },
  ) {
    return this.dictTypeService.findAll(query)
  }

  @Get('types/:id')
  @ApiOperation({ summary: '字典类型-详情' })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  @RequirePermissions('system:dict:query')
  findDictTypeById(@Param('id') id: string) {
    return this.dictTypeService.findOne(+id)
  }

  @Patch('types/:id')
  @HttpCode(200)
  @ApiOperation({ summary: '字典类型-更新' })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  @RequirePermissions('system:dict:edit')
  updateDictType(
    @Param('id') id: string,
    @Body() updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.dictTypeService.update(+id, updateDictTypeDto)
  }

  @Delete('types/:id')
  @ApiOperation({ summary: '字典类型-删除' })
  @ApiParam({ name: 'id', description: '字典类型ID' })
  @RequirePermissions('system:dict:remove')
  removeDictType(@Param('id') id: string) {
    return this.dictTypeService.remove(+id)
  }

  // ==================== 字典数据管理 ====================

  @Post('data')
  @HttpCode(200)
  @ApiOperation({ summary: '字典数据-创建' })
  @RequirePermissions('system:dict:add')
  createDictData(@Body() createDictDataDto: CreateDictDataDto) {
    return this.dictDataService.create(createDictDataDto)
  }

  @Get('data')
  @ApiOperation({ summary: '字典数据-列表' })
  @RequirePermissions('system:dict:list')
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
  @ApiQuery({
    name: 'name',
    required: false,
    description: '字典标签',
    example: '男',
  })
  @ApiQuery({
    name: 'value',
    required: false,
    description: '字典键值',
    example: '1',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '状态（0正常 1停用）',
    example: 0,
  })
  findDictDataPage(
    @Query()
    query: {
      pageNum?: number
      pageSize?: number
      dictType?: string
      name?: string
      value?: string
      status?: number
    },
  ) {
    return this.dictDataService.findAll(query)
  }

  @Get('data/:id')
  @ApiOperation({ summary: '字典数据-详情' })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  @RequirePermissions('system:dict:query')
  findDictDataById(@Param('id') id: string) {
    return this.dictDataService.findOne(+id)
  }

  @Patch('data/:id')
  @HttpCode(200)
  @ApiOperation({ summary: '字典数据-更新' })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  @RequirePermissions('system:dict:edit')
  updateDictData(
    @Param('id') id: string,
    @Body() updateDictDataDto: UpdateDictDataDto,
  ) {
    return this.dictDataService.update(+id, updateDictDataDto)
  }

  @Delete('data/:id')
  @ApiOperation({ summary: '字典数据-删除' })
  @ApiParam({ name: 'id', description: '字典数据ID' })
  @RequirePermissions('system:dict:remove')
  removeDictData(@Param('id') id: string) {
    return this.dictDataService.remove(+id)
  }

  @Get('data/type/:dictType')
  @ApiOperation({ summary: '字典数据-按类型查询' })
  @ApiParam({ name: 'dictType', description: '字典类型' })
  @RequirePermissions('system:dict:query')
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
