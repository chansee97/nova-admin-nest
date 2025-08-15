import type { CreateDeptDto } from './dto/create-dept.dto'
import type { UpdateDeptDto } from './dto/update-dept.dto'
import type { SearchQuery } from '@/common/dto'
import { DeptService } from './dept.service'
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

@ApiTags('Dept')
@ApiBearerAuth('JWT-auth')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post('create')
  @ApiOperation({ summary: '创建部门', description: '创建新的部门' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '部门名称已存在或父部门不存在' })
  @Permissions('system:dept:add')
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto)
  }

  @Get('page')
  @ApiOperation({ summary: '分页查询部门', description: '分页获取部门列表' })
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
  @Permissions('system:dept:query')
  findAll(@Query() searchQuery: SearchQuery) {
    return this.deptService.findAll(searchQuery)
  }

  @Get('tree')
  @ApiOperation({ summary: '获取部门树', description: '获取部门树形结构' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @Permissions('system:dept:query')
  getDeptTree() {
    return this.deptService.getDeptTree()
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询部门详情',
    description: '根据部门ID查询部门详细信息',
  })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  @Permissions('system:dept:query')
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(+id)
  }

  @Patch('update')
  @ApiOperation({ summary: '更新部门信息', description: '更新部门基本信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  @Permissions('system:dept:edit')
  update(@Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(updateDeptDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除部门',
    description: '根据部门ID删除部门（软删除）',
  })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  @ApiResponse({ status: 400, description: '存在子部门或用户，无法删除' })
  @Permissions('system:dept:remove')
  remove(@Param('id') id: string) {
    return this.deptService.remove(+id)
  }
}
