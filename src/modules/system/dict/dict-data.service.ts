import type { Repository } from 'typeorm'
import { Like } from 'typeorm'
import type { CreateDictDataDto } from './dto/create-dict-data.dto'
import type { UpdateDictDataDto } from './dto/update-dict-data.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { DictData } from './entities/dict-data.entity'

@Injectable()
export class DictDataService {
  constructor(
    @InjectRepository(DictData)
    private dictDataRepository: Repository<DictData>,
  ) {}

  // 创建字典数据
  async create(createDictDataDto: CreateDictDataDto) {
    // 检查字典值是否已存在
    const existValue = await this.dictDataRepository.findOne({
      where: {
        value: createDictDataDto.value,
        dictType: createDictDataDto.dictType,
      },
    })

    if (existValue) {
      throw new ApiException('字典值已存在', ApiErrorCode.DICT_DATA_NOT_EXIST)
    }

    // 检查字典标签是否已存在
    const existLabel = await this.dictDataRepository.findOne({
      where: {
        name: createDictDataDto.name,
        dictType: createDictDataDto.dictType,
      },
    })

    if (existLabel) {
      throw new ApiException('字典标签已存在', ApiErrorCode.DICT_DATA_NOT_EXIST)
    }

    const dictData = this.dictDataRepository.create(createDictDataDto)
    return await this.dictDataRepository.save(dictData)
  }

  // 分页查询字典数据
  async findAll(
    searchQuery: SearchQuery & {
      dictType?: string
      name?: string
      value?: string
      status?: number
    },
  ) {
    // 设置默认分页参数，防止返回所有记录
    const pageNum = searchQuery.pageNum || 1
    const pageSize = searchQuery.pageSize || 10

    const skip = (pageNum - 1) * pageSize
    const take = pageSize

    const whereCondition: any = {}

    if (searchQuery.dictType) {
      whereCondition.dictType = searchQuery.dictType
    }

    if (searchQuery.name) {
      whereCondition.name = Like(`%${searchQuery.name}%`)
    }

    if (searchQuery.status !== undefined) {
      whereCondition.status = searchQuery.status
    }

    const [list, total] = await this.dictDataRepository.findAndCount({
      where: whereCondition,
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

  // 查询单个字典数据
  async findOne(id: number) {
    const dictData = await this.dictDataRepository.findOne({
      where: {
        id: id,
      },
    })

    if (!dictData) {
      throw new ApiException('字典数据不存在', ApiErrorCode.DICT_DATA_NOT_EXIST)
    }

    return dictData
  }

  // 根据字典类型查询字典数据
  async findByType(dictType: string) {
    const dictDataList = await this.dictDataRepository.find({
      where: {
        dictType,
        status: 0,
      },
      order: {
        sort: 'ASC',
      },
    })

    return dictDataList
  }

  // 更新字典数据
  async update(id: number, updateDictDataDto: UpdateDictDataDto) {
    const updateData = updateDictDataDto

    // 检查是否存在
    await this.findOne(id)

    // 如果更新字典值，检查是否重复
    if (updateData.value) {
      const existValue = await this.dictDataRepository.findOne({
        where: {
          value: updateData.value,
          dictType: updateDictDataDto.dictType,
          id: { $ne: id } as any,
        },
      })

      if (existValue) {
        throw new ApiException('字典值已存在', ApiErrorCode.DICT_DATA_NOT_EXIST)
      }
    }

    await this.dictDataRepository.update(id, updateData)
    return '字典数据修改成功'
  }

  // 删除字典数据（硬删除）
  async remove(id: number) {
    const dictData = await this.dictDataRepository.findOne({
      where: {
        id: id,
      },
    })

    if (!dictData) {
      throw new ApiException('字典数据不存在', ApiErrorCode.DICT_DATA_NOT_EXIST)
    }

    // 硬删除
    await this.dictDataRepository.remove(dictData)
    return '删除成功'
  }

  // 刷新字典缓存（预留接口）
  refreshCache() {
    // 这里可以实现 Redis 缓存刷新逻辑
    return '缓存刷新成功'
  }
}
