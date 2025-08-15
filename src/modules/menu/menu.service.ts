import type { Repository } from 'typeorm'
import type { CreateMenuDto } from './dto/create-menu.dto'
import type { UpdateMenuDto } from './dto/update-menu.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiErrorCode } from '@/common/enum'
import { ApiException } from '@/common/filters'
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
      where: { menuName: createMenuDto.menuName },
    })

    if (existMenu)
      throw new ApiException('菜单名称已存在', ApiErrorCode.SERVER_ERROR)

    await this.menuRepository.save(createMenuDto)
    return '菜单新增成功'
  }

  async findAll(searchQuery: SearchQuery) {
    let skip = 0
    let take = 0

    if (searchQuery.pageNum && searchQuery.pageSize) {
      skip = (searchQuery.pageNum - 1) * searchQuery.pageSize
      take = searchQuery.pageSize
    }

    const [list, total] = await this.menuRepository.findAndCount({
      skip,
      take,
      order: { sort: 'ASC', createTime: 'DESC' },
    })
    return {
      list,
      total,
    }
  }

  // 获取菜单树结构
  async getMenuTree() {
    const menus = await this.menuRepository.find({
      where: { status: 1 },
      order: { sort: 'ASC' },
    })

    return this.buildMenuTree(menus)
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
      .andWhere('menu.status = :status', { status: 1 })
      .orderBy('menu.sort', 'ASC')
      .getMany()

    return this.buildMenuTree(menus)
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
      .andWhere('menu.status = :status', { status: 1 })
      .select(['menu.perms'])
      .getMany()

    return menus.map(menu => menu.perms)
  }

  // 构建菜单树
  private buildMenuTree(menus: Menu[], parentId: number | null = null): any[] {
    return menus
      .filter(menu => menu.parentId === parentId)
      .map(menu => ({
        ...menu,
        children: this.buildMenuTree(menus, menu.id),
      }))
  }

  async findOne(id: number) {
    const existData = await this.menuRepository.findOne({
      where: { id },
    })

    if (!existData)
      throw new ApiException('操作对象不存在', ApiErrorCode.SERVER_ERROR)

    return existData
  }

  async update(updateMenuDto: UpdateMenuDto) {
    const { id } = updateMenuDto
    await this.findOne(id)

    await this.menuRepository.update(id, updateMenuDto)

    return '更新成功'
  }

  async remove(id: number) {
    await this.findOne(id)

    await this.menuRepository.delete(id)
    return '删除成功'
  }
}
