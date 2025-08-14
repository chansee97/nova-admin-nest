import type { Repository } from 'typeorm'
import type { CreatePermissionDto } from './dto/create-permission.dto'
import type { UpdatePermissionDto } from './dto/update-permission.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiErrorCode } from '@/common/enum'
import { ApiException } from '@/common/filters'
import { Permission } from './entities/permission.entity'

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const name = createPermissionDto.name
    const existPermission = await this.permissionRepository.findOne({
      where: { name },
    })

    if (existPermission)
      throw new ApiException('权限字段已存在', ApiErrorCode.SERVER_ERROR)

    await this.permissionRepository.save(createPermissionDto)
    return '权限新增成功'
  }

  async findAll(searchQuery: SearchQuery) {
    let skip = 0
    let take = 0

    if (searchQuery.pageNum && searchQuery.pageSize) {
      skip = (searchQuery.pageNum - 1) * searchQuery.pageSize
      take = searchQuery.pageSize
    }

    const [list, total] = await this.permissionRepository.findAndCount({
      skip,
      take,
    })
    return {
      list,
      total,
    }
  }

  async findOne(id: string) {
    const existPermission = await this.permissionRepository.findOne({
      where: { id },
    })

    if (!existPermission)
      throw new ApiException('操作对象不存在', ApiErrorCode.SERVER_ERROR)

    return existPermission
  }

  async update(updatePermissionDto: UpdatePermissionDto) {
    const { id } = updatePermissionDto
    await this.findOne(id)

    await this.permissionRepository.update(id, updatePermissionDto)

    return '更新成功'
  }

  async remove(id: string) {
    await this.findOne(id)

    await this.permissionRepository.delete(id)
    return '删除成功'
  }
}
