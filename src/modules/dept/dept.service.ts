import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'
import { Dept } from './entities/dept.entity'
import { ApiException } from '@/common/filters'
import { ApiErrorCode } from '@/common/enum'
import type { SearchQuery } from '@/common/dto'

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private readonly deptRepository: Repository<Dept>,
  ) {}

  // 创建部门
  async create(createDeptDto: CreateDeptDto) {
    // 检查部门名称是否已存在
    const existingDept = await this.deptRepository.findOne({
      where: {
        deptName: createDeptDto.deptName,
        delFlag: 0,
      },
    })

    if (existingDept) {
      throw new ApiException('部门名称已存在', ApiErrorCode.DEPT_NAME_EXISTS)
    }

    // 如果有父部门，检查父部门是否存在
    if (createDeptDto.parentId && createDeptDto.parentId > 0) {
      const parentDept = await this.deptRepository.findOne({
        where: {
          deptId: createDeptDto.parentId,
          delFlag: 0,
        },
      })

      if (!parentDept) {
        throw new ApiException(
          '父部门不存在',
          ApiErrorCode.PARENT_DEPT_NOT_EXIST,
        )
      }

      // 自动生成祖级列表
      createDeptDto.ancestors = parentDept.ancestors
        ? `${parentDept.ancestors},${parentDept.deptId}`
        : `${parentDept.deptId}`
    }

    const dept = this.deptRepository.create(createDeptDto)
    return await this.deptRepository.save(dept)
  }

  // 分页查询部门
  async findAll(searchQuery: SearchQuery) {
    const { pageNum = 1, pageSize = 10 } = searchQuery
    const skip = (pageNum - 1) * pageSize

    const [list, total] = await this.deptRepository.findAndCount({
      where: {
        delFlag: 0,
      },
      order: {
        sort: 'ASC',
        createTime: 'DESC',
      },
      skip,
      take: pageSize,
    })

    return {
      list,
      total,
      pageNum,
      pageSize,
    }
  }

  // 获取部门树结构
  async getDeptTree() {
    const depts = await this.deptRepository.find({
      where: {
        status: 1,
        delFlag: 0,
      },
      order: { sort: 'ASC' },
    })

    return this.buildDeptTree(depts)
  }

  // 构建部门树
  private buildDeptTree(depts: Dept[], parentId = 0): any[] {
    const tree = []

    for (const dept of depts) {
      if (dept.parentId === parentId) {
        const children = this.buildDeptTree(depts, dept.deptId)
        const node = {
          ...dept,
          children: children.length > 0 ? children : undefined,
        }
        tree.push(node)
      }
    }

    return tree
  }

  // 查询单个部门
  async findOne(id: number) {
    const dept = await this.deptRepository.findOne({
      where: {
        deptId: id,
        delFlag: 0,
      },
      relations: ['users'], // 包含用户信息
    })

    if (!dept) {
      throw new ApiException('部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
    }

    return dept
  }

  // 更新部门
  async update(updateDeptDto: UpdateDeptDto) {
    const { deptId, ...updateData } = updateDeptDto

    const dept = await this.deptRepository.findOne({
      where: {
        deptId,
        delFlag: 0,
      },
    })

    if (!dept) {
      throw new ApiException('部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
    }

    // 检查部门名称是否重复（排除自己）
    if (updateData.deptName) {
      const existingDept = await this.deptRepository.findOne({
        where: {
          deptName: updateData.deptName,
          delFlag: 0,
        },
      })

      if (existingDept && existingDept.deptId !== deptId) {
        throw new ApiException('部门名称已存在', ApiErrorCode.DEPT_NAME_EXISTS)
      }
    }

    // 更新部门信息
    Object.assign(dept, updateData)
    return await this.deptRepository.save(dept)
  }

  // 删除部门（软删除）
  async remove(id: number) {
    const dept = await this.deptRepository.findOne({
      where: {
        deptId: id,
        delFlag: 0,
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
        delFlag: 0,
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

    // 软删除
    dept.delFlag = 1
    return await this.deptRepository.save(dept)
  }
}
