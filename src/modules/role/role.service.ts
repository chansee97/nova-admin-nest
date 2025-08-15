import type { Repository } from 'typeorm'
import type { CreateRoleDto } from './dto/create-role.dto'
import type { SetMenusDto } from './dto/set-menus.dto'
import type { UpdateRoleDto } from './dto/update-role.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In } from 'typeorm'
import { ApiErrorCode } from '@/common/enum'
import { ApiException } from '@/common/filters'
import { Menu } from '../menu/entities/menu.entity'
import { Role } from './entities/role.entity'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    // 检查角色名称是否已存在
    const existRoleName = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    })

    if (existRoleName)
      throw new ApiException('角色名称已存在', ApiErrorCode.SERVER_ERROR)

    // 检查角色编码是否已存在
    const existRoleCode = await this.roleRepository.findOne({
      where: { roleKey: createRoleDto.roleKey },
    })

    if (existRoleCode)
      throw new ApiException('角色编码已存在', ApiErrorCode.SERVER_ERROR)

    await this.roleRepository.save(createRoleDto)

    return '角色新增成功'
  }

  async findAll(searchQuery: SearchQuery) {
    let skip = 0
    let take = 0

    if (searchQuery.pageNum && searchQuery.pageSize) {
      skip = (searchQuery.pageNum - 1) * searchQuery.pageSize
      take = searchQuery.pageSize
    }

    const [list, total] = await this.roleRepository.findAndCount({
      skip,
      take,
    })
    return {
      list,
      total,
    }
  }

  async findOne(id: number) {
    const existData = await this.roleRepository.findOne({
      where: { id },
      relations: ['menus'],
    })

    if (!existData)
      throw new ApiException('操作对象不存在', ApiErrorCode.SERVER_ERROR)

    return existData
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const { id } = updateRoleDto

    // 检查是否存在
    await this.findOne(id)

    await this.roleRepository.update(id, updateRoleDto)
    return '角色修改成功'
  }

  async setMenus(setMenusDto: SetMenusDto) {
    const { roleId, menuIds } = setMenusDto

    const role = await this.findOne(roleId)

    const menus = await this.menuRepository.find({
      where: {
        id: In(menuIds),
      },
    })

    role.menus = menus

    await this.roleRepository.save(role)

    return '菜单权限设置成功'
  }

  async remove(id: number) {
    const role = await this.findOne(id)

    await this.roleRepository.remove(role)
    return '删除成功'
  }
}
