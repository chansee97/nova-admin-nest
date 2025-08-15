import type { Repository } from 'typeorm'
import type { CreateUserDto } from './dto/create-user.dto'
import type { SetRoleDto } from './dto/set-roles.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In } from 'typeorm'
import { ApiErrorCode } from '@/common/enum'
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

    if (existUser) throw new ApiException('用户已存在', ApiErrorCode.USER_EXIST)

    try {
      const newUser = this.userRepository.create(createUserDto)
      await this.userRepository.save(newUser)
      return '注册成功'
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(searchQuery: SearchQuery) {
    let skip = 0
    let take = 0

    if (searchQuery.pageNum && searchQuery.pageSize) {
      skip = (searchQuery.pageNum - 1) * searchQuery.pageSize
      take = searchQuery.pageSize
    }

    const [list, total] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'nickname', 'avatar', 'email', 'tel', 'notes'],
      skip,
      take,
      where: {
        deletedAt: null,
      },
    })

    return {
      list,
      total,
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'username', 'nickname', 'avatar', 'email', 'tel', 'notes'],
      where: {
        id,
        deletedAt: null,
      },
      relations: ['roles'],
    })

    if (!user)
      throw new ApiException('未找到该用户信息', ApiErrorCode.USER_NOTEXIST)

    return user
  }

  async findOneByUserName(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
        deletedAt: null,
      },
    })
    if (!user)
      throw new ApiException('未找到该用户信息', ApiErrorCode.USER_NOTEXIST)

    delete user.deletedAt
    return user
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto

    if (updateUserDto.password)
      updateUserDto.password = encryptData(updateUserDto.password)

    await this.userRepository.update(id, updateUserDto)
    return '更新成功'
  }

  async setRole(setRoleDto: SetRoleDto) {
    const { userId, roleIds } = setRoleDto

    const user = await this.findOne(userId)

    const roles = await this.roleRepository.find({
      where: {
        id: In(roleIds),
      },
    })

    user.roles = roles

    await this.userRepository.save(user)

    return '设置成功'
  }

  async remove(id: number) {
    const user = await this.findOne(id)

    await this.userRepository.remove(user)

    return '删除成功'
  }

  async findPermissionNames(username: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    })
    if (user) {
      const permissions = user.roles.flatMap(role => role.permissions)
      const permissionNames = permissions.map(item => item.name)

      return [...new Set(permissionNames)]
    } else {
      return []
    }
  }
}
