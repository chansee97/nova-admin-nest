import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'
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
  Patch,
  Req,
} from '@nestjs/common'
import type { Request } from 'express'
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'
import { RequirePermissions } from '@/common/decorators'

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
  @RequirePermissions('system:dept:add')
  @Post()
  @HttpCode(200)
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto)
  }

  @ApiOperation({ summary: '分页查询部门' })
  @RequirePermissions('system:dept:list')
  @Get()
  findAll(
    @Req() request: Request,
    @Query() query: { deptName?: string; status?: number },
  ) {
    const session = (request as any).session
    return this.deptService.findAll(query, session)
  }

  @Get('options')
  @ApiOperation({ summary: '部门下拉选项' })
  findOptions(@Req() request: Request) {
    const session = (request as any).session
    return this.deptService.findOptions(session)
  }

  @ApiOperation({ summary: '查询部门详情' })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @RequirePermissions('system:dept:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新部门信息' })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @RequirePermissions('system:dept:edit')
  update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(+id, updateDeptDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @ApiParam({ name: 'id', description: '部门ID', example: 1 })
  @RequirePermissions('system:dept:remove')
  remove(@Param('id') id: string) {
    return this.deptService.remove(+id)
  }
}
