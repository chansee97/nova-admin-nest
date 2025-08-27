import type { Repository } from 'typeorm'
import type { CreateMenuDto } from './dto/create-menu.dto'
import type { UpdateMenuDto } from './dto/update-menu.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In } from 'typeorm'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { buildTree, buildSelectTree } from '@/utils'
import { Menu } from './entities/menu.entity'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    // 检查权限标识符是否已存在
    if (createMenuDto.perms) {
      const existPermission = await this.menuRepository.findOne({
        where: { perms: createMenuDto.perms },
      })

      if (existPermission)
        throw new ApiException('权限标识符已存在', ApiErrorCode.SERVER_ERROR)
    }

    // 检查菜单名称是否已存在
    const existMenu = await this.menuRepository.findOne({
      where: { title: createMenuDto.title },
    })

    if (existMenu)
      throw new ApiException('菜单名称已存在', ApiErrorCode.SERVER_ERROR)

    await this.menuRepository.save(createMenuDto)

    return
  }

  async findAll() {
    // 菜单模块直接返回所有菜单
    const list = await this.menuRepository.find()

    return list
  }

  // 获取菜单下拉树形结构
  async findOptions() {
    const menus = await this.menuRepository.find({
      where: {
        status: 0,
        menuType: In(['directory', 'page']), // 排除permission类型，只返回目录和页面
      },
      select: ['id', 'title', 'parentId'], // 返回需要的字段
      order: { sort: 'ASC' },
    })

    return buildSelectTree(menus, {
      customID: 'id',
      labelKey: 'title',
      valueKey: 'id',
    })
  }

  // 根据用户角色获取菜单权限
  async getMenusByRoles(roleIds: number[]) {
    if (!roleIds || roleIds.length === 0) {
      return []
    }

    const menus = await this.menuRepository
      .createQueryBuilder('menu')
      .innerJoin('menu.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .andWhere('menu.status = :status', { status: 0 })
      .orderBy('menu.sort', 'ASC')
      .getMany()

    return buildTree(menus, {
      customID: 'id',
    })
  }

  // 获取用户权限列表
  async getPermissionsByRoles(roleIds: number[]): Promise<string[]> {
    if (!roleIds || roleIds.length === 0) {
      return []
    }

    const menus = await this.menuRepository
      .createQueryBuilder('menu')
      .innerJoin('menu.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .andWhere('menu.status = :status', { status: 0 })
      .select(['menu.perms'])
      .getMany()

    return menus.map(menu => menu.perms)
  }

  async findOne(id: number) {
    const existData = await this.menuRepository.findOne({
      where: { id: id },
    })

    if (!existData)
      throw new ApiException('操作对象不存在', ApiErrorCode.SERVER_ERROR)

    return existData
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id)

    await this.menuRepository.update(id, updateMenuDto)

    return
  }

  async remove(id: number) {
    const menu = await this.menuRepository.findOne({
      where: {
        id: id,
      },
    })

    if (!menu) {
      throw new ApiException('菜单不存在', ApiErrorCode.SERVER_ERROR)
    }

    await this.menuRepository.softRemove(menu)
    return
  }
}
