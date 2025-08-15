import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateDictDataDto } from './dto/create-dict-data.dto'
import { UpdateDictDataDto } from './dto/update-dict-data.dto'
import { DictData } from './entities/dict-data.entity'
import { DictType } from './entities/dict-type.entity'
import { ApiException } from '@/common/filters'
import { ApiErrorCode } from '@/common/enum'
import type { SearchQuery } from '@/common/dto'

@Injectable()
export class DictDataService {
  constructor(
    @InjectRepository(DictData)
    private readonly dictDataRepository: Repository<DictData>,
    @InjectRepository(DictType)
    private readonly dictTypeRepository: Repository<DictType>,
  ) {}

  // 创建字典数据
  async create(createDictDataDto: CreateDictDataDto) {
    // 检查字典类型是否存在
    const dictType = await this.dictTypeRepository.findOne({
      where: {
        dictType: createDictDataDto.dictType,
        delFlag: 0,
      },
    })

    if (!dictType) {
      throw new ApiException('字典类型不存在', ApiErrorCode.DICT_TYPE_NOT_EXIST)
    }

    // 检查字典值是否已存在
    const existingDictData = await this.dictDataRepository.findOne({
      where: {
        dictType: createDictDataDto.dictType,
        dictValue: createDictDataDto.dictValue,
        delFlag: 0,
      },
    })

    if (existingDictData) {
      throw new ApiException('字典键值已存在', ApiErrorCode.DICT_DATA_EXISTS)
    }

    const dictData = this.dictDataRepository.create(createDictDataDto)
    return await this.dictDataRepository.save(dictData)
  }

  // 分页查询字典数据
  async findAll(searchQuery: SearchQuery & { dictType?: string }) {
    const { pageNum = 1, pageSize = 10, dictType } = searchQuery
    const skip = (pageNum - 1) * pageSize

    const whereCondition: any = {
      delFlag: 0,
    }

    if (dictType) {
      whereCondition.dictType = dictType
    }

    const [list, total] = await this.dictDataRepository.findAndCount({
      where: whereCondition,
      order: {
        dictSort: 'ASC',
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

  // 查询单个字典数据
  async findOne(id: number) {
    const dictData = await this.dictDataRepository.findOne({
      where: {
        dictCode: id,
        delFlag: 0,
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
        delFlag: 0,
        status: 1,
      },
      order: {
        dictSort: 'ASC',
      },
    })

    return dictDataList.map(item => ({
      label: item.dictLabel,
      value: item.dictValue,
      cssClass: item.cssClass,
      listClass: item.listClass,
      isDefault: item.isDefault,
    }))
  }

  // 更新字典数据
  async update(updateDictDataDto: UpdateDictDataDto) {
    const { dictCode, ...updateData } = updateDictDataDto

    const dictData = await this.dictDataRepository.findOne({
      where: {
        dictCode,
        delFlag: 0,
      },
    })

    if (!dictData) {
      throw new ApiException('字典数据不存在', ApiErrorCode.DICT_DATA_NOT_EXIST)
    }

    // 检查字典值是否重复（排除自己）
    if (updateData.dictValue) {
      const existingDictData = await this.dictDataRepository.findOne({
        where: {
          dictType: updateData.dictType || dictData.dictType,
          dictValue: updateData.dictValue,
          delFlag: 0,
        },
      })

      if (existingDictData && existingDictData.dictCode !== dictCode) {
        throw new ApiException('字典键值已存在', ApiErrorCode.DICT_DATA_EXISTS)
      }
    }

    // 更新字典数据信息
    Object.assign(dictData, updateData)
    return await this.dictDataRepository.save(dictData)
  }

  // 删除字典数据（软删除）
  async remove(id: number) {
    const dictData = await this.dictDataRepository.findOne({
      where: {
        dictCode: id,
        delFlag: 0,
      },
    })

    if (!dictData) {
      throw new ApiException('字典数据不存在', ApiErrorCode.DICT_DATA_NOT_EXIST)
    }

    // 软删除
    dictData.delFlag = 1
    return await this.dictDataRepository.save(dictData)
  }

  // 刷新字典缓存（预留接口）
  refreshCache() {
    // 这里可以实现 Redis 缓存刷新逻辑
    return { message: '字典缓存刷新成功' }
  }
}
