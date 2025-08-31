import type { Repository } from 'typeorm'
import { Not, Like } from 'typeorm'
import type { CreateDeptDto } from './dto/create-dept.dto'
import type { UpdateDeptDto } from './dto/update-dept.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { Dept } from './entities/dept.entity'
import { buildSelectTree } from '@/utils'

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private deptRepository: Repository<Dept>,
  ) {}

  // 创建部门
  async create(createDeptDto: CreateDeptDto) {
    // 检查部门名称是否已存在
    const existingDept = await this.deptRepository.findOne({
      where: {
        deptName: createDeptDto.deptName,
      },
    })

    if (existingDept) {
      throw new ApiException('部门名称已存在', ApiErrorCode.DEPT_NAME_EXISTS)
    }

    // 如果有父部门，检查父部门是否存在
    if (createDeptDto.parentId && createDeptDto.parentId > 0) {
      const parentDept = await this.deptRepository.findOne({
        where: {
          id: createDeptDto.parentId,
        },
      })

      if (!parentDept) {
        throw new ApiException('父部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
      }

      // 自动生成祖级列表
      createDeptDto.ancestors = parentDept.ancestors
        ? `${parentDept.ancestors},${parentDept.id}`
        : `${parentDept.id}`
    }

    const dept = this.deptRepository.create(createDeptDto)
    return await this.deptRepository.save(dept)
  }

  // 分页查询部门
  async findAll(searchQuery: { deptName?: string; status?: number }) {
    // 构建查询条件
    const where: any = {}

    if (searchQuery.deptName) {
      // 使用 LIKE 进行模糊搜索，支持中文
      where.deptName = Like(`%${searchQuery.deptName}%`)
    }

    if (searchQuery.status !== undefined) {
      where.status = searchQuery.status
    }

    const list = await this.deptRepository.find({
      where,
      order: {
        sort: 'ASC',
        createTime: 'DESC',
      },
    })

    return list
  }

  async findOptions() {
    const depts = await this.deptRepository.find({
      where: { status: 0 }, // 只查询正常状态的部门
      select: ['id', 'deptName', 'parentId'], // 返回需要的字段
      order: {
        sort: 'ASC',
        createTime: 'ASC',
      },
    })

    // 构建树形结构
    return buildSelectTree(depts, {
      customID: 'id',
      labelKey: 'deptName',
      valueKey: 'id',
    })
  }

  // 查询部门详情
  async findOne(id: number) {
    const dept = await this.deptRepository.findOne({
      where: {
        id: id,
      },
    })

    if (!dept) {
      throw new ApiException('部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
    }

    return dept
  }

  // 更新部门
  async update(id: number, updateDeptDto: UpdateDeptDto) {
    // 如果更新部门名称，检查是否重复
    if (updateDeptDto.deptName) {
      const existingDept = await this.deptRepository.findOne({
        where: {
          deptName: updateDeptDto.deptName,
          id: Not(id),
        },
      })

      if (existingDept) {
        throw new ApiException('部门名称已存在', ApiErrorCode.DEPT_NAME_EXISTS)
      }
    }

    // 如果更新父部门，检查父部门是否存在且不能是自己
    if (updateDeptDto.parentId && updateDeptDto.parentId > 0) {
      if (updateDeptDto.parentId === id) {
        throw new ApiException(
          '不能将自己设为父部门',
          ApiErrorCode.DEPT_NOT_EXIST,
        )
      }

      const parentDept = await this.deptRepository.findOne({
        where: {
          id: updateDeptDto.parentId,
        },
      })

      if (!parentDept) {
        throw new ApiException('父部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
      }
    }

    await this.deptRepository.update(id, updateDeptDto)
    return '部门修改成功'
  }

  // 删除部门（硬删除）
  async remove(id: number) {
    const dept = await this.deptRepository.findOne({
      where: {
        id: id,
      },
      relations: ['users'],
    })

    if (!dept) {
      throw new ApiException('部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
    }

    // 检查是否有子部门
    const childDepts = await this.deptRepository.find({
      where: {
        parentId: id,
      },
    })

    if (childDepts.length > 0) {
      throw new ApiException(
        '存在子部门，无法删除',
        ApiErrorCode.DEPT_HAS_CHILDREN,
      )
    }

    // 检查是否有用户
    if (dept.users && dept.users.length > 0) {
      throw new ApiException(
        '部门下存在用户，无法删除',
        ApiErrorCode.DEPT_HAS_USERS,
      )
    }

    // 硬删除
    await this.deptRepository.remove(dept)
    return '删除成功'
  }
}
