import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'
import { SearchQuery } from '@/common/dto'
import { DeptService } from './dept.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  HttpCode,
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

@ApiTags('部门管理')
@ApiBearerAuth('JWT-auth')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @ApiOperation({ summary: '创建部门' })
  @ApiBody({
    type: CreateDeptDto,
    required: true,
  })
  @Permissions('system:dept:add')
  @Post()
  @HttpCode(200)
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto)
  }

  @ApiOperation({ summary: '分页查询部门' })
  @Permissions('system:dept:query')
  @Get()
  findAll(@Query() searchQuery: SearchQuery) {
    return this.deptService.findAll(searchQuery)
  }

  @ApiOperation({ summary: '查询部门详情' })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @Permissions('system:dept:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(+id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新部门信息' })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @Permissions('system:dept:edit')
  update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(+id, updateDeptDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @Permissions('system:dept:remove')
  remove(@Param('id') id: string) {
    return this.deptService.remove(+id)
  }

  @ApiOperation({ summary: '获取部门树形结构' })
  @Permissions('system:dept:query')
  @Get('tree')
  getDeptTree() {
    return this.deptService.getDeptTree()
  }
}
