import type { Repository } from 'typeorm'
import type { CreateRoleDto } from './dto/create-role.dto'

import type { UpdateRoleDto } from './dto/update-role.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Like } from 'typeorm'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { Menu } from '../menu/entities/menu.entity'
import { Role } from './entities/role.entity'
import { Dept } from '../dept/entities/dept.entity'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Dept)
    private deptRepository: Repository<Dept>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { menuIds, deptIds, ...roleData } = createRoleDto

    // 检查角色名称是否已存在
    const existRoleName = await this.roleRepository.findOne({
      where: { roleName: roleData.roleName },
    })

    if (existRoleName)
      throw new ApiException('角色名称已存在', ApiErrorCode.SERVER_ERROR)

    // 检查角色编码是否已存在
    const existRoleCode = await this.roleRepository.findOne({
      where: { roleKey: roleData.roleKey },
    })

    if (existRoleCode)
      throw new ApiException('角色编码已存在', ApiErrorCode.SERVER_ERROR)

    // 创建角色
    const role = this.roleRepository.create(roleData)
    await this.roleRepository.save(role)

    // 如果提供了菜单ID，则设置菜单权限
    if (menuIds && menuIds.length > 0) {
      const menus = await this.menuRepository.find({
        where: {
          id: In(menuIds),
        },
      })
      role.menus = menus
      await this.roleRepository.save(role)
    }

    // 如果提供了部门ID，则设置部门关联
    if (deptIds && deptIds.length > 0) {
      const depts = await this.deptRepository.find({
        where: {
          id: In(deptIds),
        },
      })
      role.depts = depts
      await this.roleRepository.save(role)
    }

    return '角色新增成功'
  }

  async findAll(
    searchQuery: SearchQuery & {
      roleName?: string
      roleKey?: string
      status?: number
    },
  ) {
    // 设置默认分页参数，防止返回所有记录
    const pageNum = searchQuery.pageNum || 1
    const pageSize = searchQuery.pageSize || 10

    const skip = (pageNum - 1) * pageSize
    const take = pageSize

    // 构建查询条件
    const where: any = {}

    if (searchQuery.roleName) {
      where.roleName = Like(`%${searchQuery.roleName}%`)
    }

    if (searchQuery.roleKey) {
      where.roleKey = Like(`%${searchQuery.roleKey}%`)
    }

    if (searchQuery.status !== undefined) {
      where.status = searchQuery.status
    }

    const [list, total] = await this.roleRepository.findAndCount({
      where,
      skip,
      take,
      order: {
        createTime: 'DESC',
      },
    })

    return {
      list,
      total,
    }
  }

  async findOptions() {
    const roles = await this.roleRepository.find({
      where: { status: 0 }, // 只查询正常状态的角色
      select: ['id', 'roleName'], // 只返回需要的字段
      order: {
        createTime: 'ASC',
      },
    })

    return roles.map(role => ({
      value: role.id,
      label: role.roleName,
    }))
  }

  async findOne(id: number) {
    const existData = await this.roleRepository.findOne({
      where: { id: id },
      relations: ['menus', 'depts'],
    })

    if (!existData)
      throw new ApiException('操作对象不存在', ApiErrorCode.SERVER_ERROR)

    return existData
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { menuIds, deptIds, ...roleData } = updateRoleDto

    // 检查是否存在
    const role = await this.findOne(id)

    // 更新角色基本信息
    if (Object.keys(roleData).length > 0) {
      await this.roleRepository.update(id, roleData)
    }

    // 如果提供了菜单ID，则更新菜单权限
    if (menuIds !== undefined) {
      if (menuIds.length > 0) {
        const menus = await this.menuRepository.find({
          where: {
            id: In(menuIds),
          },
        })
        role.menus = menus
      } else {
        // 如果menuIds为空数组，则清空菜单权限
        role.menus = []
      }
      await this.roleRepository.save(role)
    }

    // 如果提供了部门ID，则更新部门关联
    if (deptIds !== undefined) {
      if (deptIds.length > 0) {
        const depts = await this.deptRepository.find({
          where: {
            id: In(deptIds),
          },
        })
        role.depts = depts
      } else {
        // 如果deptIds为空数组，则清空部门关联
        role.depts = []
      }
      await this.roleRepository.save(role)
    }

    return '角色修改成功'
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id: id,
      },
    })

    if (!role) {
      throw new ApiException('角色不存在', ApiErrorCode.SERVER_ERROR)
    }

    await this.roleRepository.softRemove(role)
    return '删除成功'
  }
}
