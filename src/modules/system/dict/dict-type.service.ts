import type { Repository } from 'typeorm'
import type { CreateDictTypeDto } from './dto/create-dict-type.dto'
import type { UpdateDictTypeDto } from './dto/update-dict-type.dto'
import type { SearchQuery } from '@/common/dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like } from 'typeorm'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { DictType } from './entities/dict-type.entity'
import { DictData } from './entities/dict-data.entity'

@Injectable()
export class DictTypeService {
  constructor(
    @InjectRepository(DictType)
    private readonly dictTypeRepository: Repository<DictType>,
    @InjectRepository(DictData)
    private readonly dictDataRepository: Repository<DictData>,
  ) {}

  // 创建字典类型
  async create(createDictTypeDto: CreateDictTypeDto) {
    // 检查字典类型是否已存在
    const existingDictType = await this.dictTypeRepository.findOne({
      where: {
        type: createDictTypeDto.type,
      },
    })

    if (existingDictType) {
      throw new ApiException('字典类型已存在', ApiErrorCode.SERVER_ERROR)
    }

    const dictType = this.dictTypeRepository.create(createDictTypeDto)
    return await this.dictTypeRepository.save(dictType)
  }

  // 分页查询字典类型
  async findAll(searchQuery: SearchQuery & { name?: string; type?: string }) {
    // 设置默认分页参数，防止返回所有记录
    const pageNum = searchQuery.pageNum || 1
    const pageSize = searchQuery.pageSize || 10

    const skip = (pageNum - 1) * pageSize
    const take = pageSize

    // 构建查询条件
    const where: any = {}

    if (searchQuery.name) {
      where.name = Like(`%${searchQuery.name}%`)
    }

    const [list, total] = await this.dictTypeRepository.findAndCount({
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

  // 查询单个字典类型
  async findOne(id: number) {
    const dictType = await this.dictTypeRepository.findOne({
      where: {
        id: id,
      },
      relations: ['dictDataList'],
    })

    if (!dictType) {
      throw new ApiException('字典类型不存在', ApiErrorCode.SERVER_ERROR)
    }

    return dictType
  }

  // 根据字典类型查询
  async findByType(dictType: string) {
    const result = await this.dictTypeRepository.findOne({
      where: {
        type: dictType,
        status: 0,
      },
      relations: ['dictDataList'],
    })

    if (!result) {
      throw new ApiException('字典类型不存在', ApiErrorCode.SERVER_ERROR)
    }

    // 过滤启用的字典数据并排序
    result.dictDataList = result.dictDataList
      .filter(item => item.status === 0)
      .sort((a, b) => a.sort - b.sort)

    return result
  }

  // 更新字典类型
  async update(id: number, updateDictTypeDto: UpdateDictTypeDto) {
    const updateData = updateDictTypeDto

    const dictType = await this.dictTypeRepository.findOne({
      where: {
        id,
      },
    })

    if (!dictType) {
      throw new ApiException('字典类型不存在', ApiErrorCode.SERVER_ERROR)
    }

    // 检查字典类型是否重复（排除自己）
    if (updateData.type) {
      const existingDictType = await this.dictTypeRepository.findOne({
        where: {
          type: updateData.type,
        },
      })

      if (existingDictType && existingDictType.id !== id) {
        throw new ApiException('字典类型已存在', ApiErrorCode.SERVER_ERROR)
      }
    }

    // 更新字典类型信息
    Object.assign(dictType, updateData)
    return await this.dictTypeRepository.save(dictType)
  }

  // 删除字典类型（硬删除）
  async remove(id: number) {
    const dictType = await this.dictTypeRepository.findOne({
      where: {
        id: id,
      },
    })

    if (!dictType) {
      throw new ApiException('字典类型不存在', ApiErrorCode.SERVER_ERROR)
    }

    // 检查是否有字典数据
    const dictDataCount = await this.dictDataRepository.count({
      where: {
        dictType: dictType.type,
      },
    })

    if (dictDataCount > 0) {
      throw new ApiException(
        '存在字典数据，无法删除',
        ApiErrorCode.SERVER_ERROR,
      )
    }

    // 硬删除
    await this.dictTypeRepository.remove(dictType)
    return '删除成功'
  }

  // 获取所有字典类型选项（用于下拉框）
  async getOptions() {
    const dictTypes = await this.dictTypeRepository.find({
      where: {
        status: 0,
      },
      select: ['id', 'name', 'type'],
      order: {
        createTime: 'DESC',
      },
    })

    return dictTypes.map(item => ({
      label: item.name,
      value: item.type,
    }))
  }
}
