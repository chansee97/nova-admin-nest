import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateDictTypeDto } from './dto/create-dict-type.dto'
import { UpdateDictTypeDto } from './dto/update-dict-type.dto'
import { DictType } from './entities/dict-type.entity'
import { DictData } from './entities/dict-data.entity'
import { ApiException } from '@/common/filters'
import { ApiErrorCode } from '@/common/enums'
import type { SearchQuery } from '@/common/dto'

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
        dictType: createDictTypeDto.dictType,
        delFlag: 0,
      },
    })

    if (existingDictType) {
      throw new ApiException('字典类型已存在', ApiErrorCode.DICT_TYPE_EXISTS)
    }

    const dictType = this.dictTypeRepository.create(createDictTypeDto)
    return await this.dictTypeRepository.save(dictType)
  }

  // 分页查询字典类型
  async findAll(searchQuery: SearchQuery) {
    const { pageNum = 1, pageSize = 10 } = searchQuery
    const skip = (pageNum - 1) * pageSize

    const [list, total] = await this.dictTypeRepository.findAndCount({
      where: {
        delFlag: 0,
      },
      order: {
        createTime: 'DESC',
      },
      skip,
      take: pageSize,
    })

    return {
      list,
      total,
      pageNum,
      pageSize,
    }
  }

  // 查询单个字典类型
  async findOne(id: number) {
    const dictType = await this.dictTypeRepository.findOne({
      where: {
        dictId: id,
        delFlag: 0,
      },
      relations: ['dictDataList'],
    })

    if (!dictType) {
      throw new ApiException('字典类型不存在', ApiErrorCode.DICT_TYPE_NOT_EXIST)
    }

    return dictType
  }

  // 根据字典类型查询
  async findByType(dictType: string) {
    const result = await this.dictTypeRepository.findOne({
      where: {
        dictType,
        delFlag: 0,
        status: 1,
      },
      relations: ['dictDataList'],
    })

    if (!result) {
      throw new ApiException('字典类型不存在', ApiErrorCode.DICT_TYPE_NOT_EXIST)
    }

    // 过滤启用的字典数据并排序
    result.dictDataList = result.dictDataList
      .filter(item => item.status === 1 && item.delFlag === 0)
      .sort((a, b) => a.dictSort - b.dictSort)

    return result
  }

  // 更新字典类型
  async update(updateDictTypeDto: UpdateDictTypeDto) {
    const { dictId, ...updateData } = updateDictTypeDto

    const dictType = await this.dictTypeRepository.findOne({
      where: {
        dictId,
        delFlag: 0,
      },
    })

    if (!dictType) {
      throw new ApiException('字典类型不存在', ApiErrorCode.DICT_TYPE_NOT_EXIST)
    }

    // 检查字典类型是否重复（排除自己）
    if (updateData.dictType) {
      const existingDictType = await this.dictTypeRepository.findOne({
        where: {
          dictType: updateData.dictType,
          delFlag: 0,
        },
      })

      if (existingDictType && existingDictType.dictId !== dictId) {
        throw new ApiException('字典类型已存在', ApiErrorCode.DICT_TYPE_EXISTS)
      }
    }

    // 更新字典类型信息
    Object.assign(dictType, updateData)
    return await this.dictTypeRepository.save(dictType)
  }

  // 删除字典类型（软删除）
  async remove(id: number) {
    const dictType = await this.dictTypeRepository.findOne({
      where: {
        dictId: id,
        delFlag: 0,
      },
    })

    if (!dictType) {
      throw new ApiException('字典类型不存在', ApiErrorCode.DICT_TYPE_NOT_EXIST)
    }

    // 检查是否有字典数据
    const dictDataCount = await this.dictDataRepository.count({
      where: {
        dictType: dictType.dictType,
        delFlag: 0,
      },
    })

    if (dictDataCount > 0) {
      throw new ApiException(
        '存在字典数据，无法删除',
        ApiErrorCode.DICT_TYPE_HAS_DATA,
      )
    }

    // 软删除
    dictType.delFlag = 1
    return await this.dictTypeRepository.save(dictType)
  }

  // 获取所有字典类型选项（用于下拉框）
  async getOptions() {
    const dictTypes = await this.dictTypeRepository.find({
      where: {
        delFlag: 0,
        status: 1,
      },
      select: ['dictId', 'dictName', 'dictType'],
      order: {
        createTime: 'DESC',
      },
    })

    return dictTypes.map(item => ({
      label: item.dictName,
      value: item.dictType,
    }))
  }
}
