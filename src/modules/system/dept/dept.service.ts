import type { Repository } from 'typeorm'
import type { CreateDeptDto } from './dto/create-dept.dto'
import type { UpdateDeptDto } from './dto/update-dept.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { Dept } from './entities/dept.entity'

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
          deptId: createDeptDto.parentId,
        },
      })

      if (!parentDept) {
        throw new ApiException('父部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
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
    // 设置默认分页参数，防止返回所有记录
    const pageNum = searchQuery.pageNum || 1
    const pageSize = searchQuery.pageSize || 10

    const skip = (pageNum - 1) * pageSize
    const take = pageSize

    const [list, total] = await this.deptRepository.findAndCount({
      skip,
      take,
      order: {
        sort: 'ASC',
        createTime: 'DESC',
      },
    })

    return {
      list,
      total,
    }
  }

  // 获取部门树形结构
  async getDeptTree() {
    const depts = await this.deptRepository.find({
      where: { status: 0 },
      order: { sort: 'ASC' },
    })

    // 构建树形结构
    const buildTree = (parentId = 0): any[] => {
      const children = depts.filter(dept => dept.parentId === parentId)
      return children.map(dept => ({
        ...dept,
        children: buildTree(dept.deptId),
      }))
    }

    return buildTree()
  }

  // 查询部门详情
  async findOne(id: number) {
    const dept = await this.deptRepository.findOne({
      where: {
        deptId: id,
      },
    })

    if (!dept) {
      throw new ApiException('部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
    }

    return dept
  }

  // 更新部门
  async update(deptId: number, updateDeptDto: UpdateDeptDto) {
    const updateData = updateDeptDto

    // 检查部门是否存在
    await this.findOne(deptId)

    // 如果更新部门名称，检查是否重复
    if (updateData.deptName) {
      const existingDept = await this.deptRepository.findOne({
        where: {
          deptName: updateData.deptName,
          deptId: { $ne: deptId } as any,
        },
      })

      if (existingDept) {
        throw new ApiException('部门名称已存在', ApiErrorCode.DEPT_NAME_EXISTS)
      }
    }

    // 如果更新父部门，检查父部门是否存在且不能是自己
    if (updateData.parentId && updateData.parentId > 0) {
      if (updateData.parentId === deptId) {
        throw new ApiException(
          '不能将自己设为父部门',
          ApiErrorCode.DEPT_NOT_EXIST,
        )
      }

      const parentDept = await this.deptRepository.findOne({
        where: {
          deptId: updateData.parentId,
        },
      })

      if (!parentDept) {
        throw new ApiException('父部门不存在', ApiErrorCode.DEPT_NOT_EXIST)
      }
    }

    await this.deptRepository.update(deptId, updateData)
    return '部门修改成功'
  }

  // 删除部门（硬删除）
  async remove(id: number) {
    const dept = await this.deptRepository.findOne({
      where: {
        deptId: id,
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
