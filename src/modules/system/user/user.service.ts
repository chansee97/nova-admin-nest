import type { Repository } from 'typeorm'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In } from 'typeorm'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { encryptData } from '@/utils/crypto'
import { Role } from '../role/entities/role.entity'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, ...userData } = createUserDto
    const existUser = await this.userRepository.findOne({
      where: { username },
    })

    if (existUser) throw new ApiException('用户已存在', ApiErrorCode.USER_EXIST)

    try {
      // 加密密码
      userData.password = encryptData(userData.password)

      // 创建用户基本信息
      const newUser = this.userRepository.create(userData)
      await this.userRepository.save(newUser)

      return '注册成功'
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(searchQuery: SearchQuery) {
    // 设置默认分页参数，防止返回所有记录
    const pageNum = searchQuery.pageNum || 1
    const pageSize = searchQuery.pageSize || 10

    const skip = (pageNum - 1) * pageSize
    const take = pageSize

    const [list, total] = await this.userRepository.findAndCount({
      where: {
        userStatus: 0,
      },
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

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        userId: id,
      },
      relations: {
        roles: true,
        dept: true,
      },
    })

    if (!user) {
      throw new ApiException('未找到该用户信息', ApiErrorCode.USER_NOTEXIST)
    }

    return user
  }

  async findOneByUserName(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    })
    if (!user)
      throw new ApiException('未找到该用户信息', ApiErrorCode.USER_NOTEXIST)

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roleIds, ...userData } = updateUserDto

    // 如果包含密码，需要加密
    if (userData.password) {
      userData.password = encryptData(userData.password)
    }

    // 更新用户基本信息
    await this.userRepository.update(id, userData)

    // 如果包含角色更新，需要处理用户角色关系
    if (roleIds !== undefined) {
      const user = await this.findOne(id)

      if (roleIds.length > 0) {
        // 查找指定的角色
        const roles = await this.roleRepository.find({
          where: {
            roleId: In(roleIds),
          },
        })
        user.roles = roles
      } else {
        // 如果roleIds为空数组，则清空用户角色
        user.roles = []
      }

      // 保存用户角色关系
      await this.userRepository.save(user)
    }

    return '更新成功'
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        userId: id,
      },
    })

    if (!user) {
      throw new ApiException('用户不存在', ApiErrorCode.USER_NOTEXIST)
    }

    await this.userRepository.softRemove(user)

    return '删除成功'
  }

  async findPermissionNames(username: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.menus'],
    })
    if (user) {
      const menus = user.roles.flatMap(role => role.menus)
      const permissions = menus.map(menu => menu.perms)

      return [...new Set(permissions)]
    } else {
      return []
    }
  }

  // 获取用户菜单
  async findUserMenus(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.menus'],
    })

    if (user) {
      const menus = user.roles.flatMap(role => role.menus)
      const uniqueMenus = menus.filter(
        (menu, index, self) => index === self.findIndex(m => m.id === menu.id),
      )

      return this.buildMenuTree(uniqueMenus)
    } else {
      return []
    }
  }

  // 构建菜单树
  private buildMenuTree(menus: any[], parentId: number | null = null): any[] {
    return menus
      .filter(menu => menu.parentId === parentId)
      .map(menu => ({
        ...menu,
        children: this.buildMenuTree(menus, menu.id),
      }))
  }
}
