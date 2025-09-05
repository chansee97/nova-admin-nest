import type { Repository } from 'typeorm'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { UpdatePasswordDto } from './dto/update-password.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Like } from 'typeorm'
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
    const { username } = createUserDto
    const existUser = await this.userRepository.findOne({
      where: { username },
    })

    if (existUser)
      throw new ApiException('用户已存在', ApiErrorCode.SERVER_ERROR)

    try {
      // 创建用户基本信息
      const newUser = this.userRepository.create(createUserDto)
      await this.userRepository.save(newUser)

      return '注册成功'
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(
    searchQuery: SearchQuery & {
      deptId?: number
      username?: string
      phone?: string
      status?: number
    },
  ) {
    // 设置默认分页参数，防止返回所有记录
    const pageNum = searchQuery.pageNum || 1
    const pageSize = searchQuery.pageSize || 10

    const skip = (pageNum - 1) * pageSize
    const take = pageSize

    // 构建查询条件
    const whereCondition: any = {}

    if (searchQuery.deptId) {
      whereCondition.deptId = searchQuery.deptId
    }

    if (searchQuery.username) {
      whereCondition.username = Like(`%${searchQuery.username}%`)
    }

    if (searchQuery.phone) {
      whereCondition.phone = Like(`%${searchQuery.phone}%`)
    }

    if (searchQuery.status !== undefined) {
      whereCondition.status = searchQuery.status
    }

    const [list, total] = await this.userRepository.findAndCount({
      where: whereCondition,
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
        id: id,
      },
      relations: {
        roles: true,
        dept: true,
      },
    })

    if (!user) {
      throw new ApiException('未找到该用户信息', ApiErrorCode.SERVER_ERROR)
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
      throw new ApiException('未找到该用户信息', ApiErrorCode.SERVER_ERROR)

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
            id: In(roleIds),
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

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updatePasswordDto

    // 查找用户
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'password'], // 明确选择password字段
    })

    if (!user) {
      throw new ApiException('用户不存在', ApiErrorCode.SERVER_ERROR)
    }

    // 验证旧密码
    const encryptedOldPassword = encryptData(oldPassword)
    if (user.password !== encryptedOldPassword) {
      throw new ApiException('旧密码错误', ApiErrorCode.SERVER_ERROR)
    }

    // 检查新密码是否与旧密码相同
    const encryptedNewPassword = encryptData(newPassword)
    if (user.password === encryptedNewPassword) {
      throw new ApiException(
        '新密码不能与旧密码相同',
        ApiErrorCode.SERVER_ERROR,
      )
    }

    // 更新密码
    await this.userRepository.update(userId, {
      password: encryptedNewPassword,
    })

    return '密码更新成功'
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    })

    if (!user) {
      throw new ApiException('用户不存在', ApiErrorCode.SERVER_ERROR)
    }

    await this.userRepository.softRemove(user)

    return '删除成功'
  }

  async findUserPermissions(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.menus'],
    })
    if (user) {
      const permissions = user.roles
        .flatMap(role => role.menus)
        .map(menu => menu.perms)
        .filter(Boolean)

      return [...new Set(permissions)]
    } else {
      return []
    }
  }

  async findUserRoles(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    })
    if (user) {
      const roleKeys = user.roles
        .filter(role => role.status === 0) // 只获取正常状态的角色
        .map(role => role.roleKey)
        .filter(Boolean)

      return [...new Set(roleKeys)]
    } else {
      return []
    }
  }

  async findUserMenus(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.menus'],
    })

    if (!user) {
      return []
    }

    // 获取用户所有角色的菜单，去重并过滤掉停用的菜单和权限类型
    const menus = user.roles
      .filter(role => role.status === 0) // 只获取正常状态的角色
      .flatMap(role => role.menus)
      .filter(menu => menu.status === 0) // 只获取正常状态的菜单
      .filter(menu => menu.menuType !== 'permission') // 过滤掉权限类型，只保留目录和页面
      .filter(
        (menu, index, self) => index === self.findIndex(m => m.id === menu.id),
      ) // 去重，基于菜单ID
      .sort((a, b) => a.sort - b.sort) // 按排序字段排序

    return menus
  }
}
