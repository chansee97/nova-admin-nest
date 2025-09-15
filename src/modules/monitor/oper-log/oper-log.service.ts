import { Injectable } from '@nestjs/common'
import { In, Like } from 'typeorm'
import { ReqOperLogDto } from './dto/req-oper-log.dto'
import { Between } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OperLog } from './entities/oper-log.entity'

@Injectable()
export class OperLogService {
  constructor(
    @InjectRepository(OperLog)
    private operLogRepository: Repository<OperLog>,
  ) {}

  /**
   * 记录操作日志
   */
  async create(operLog: OperLog) {
    return await this.operLogRepository.save(operLog)
  }

  /**
   * 查询
   */
  async list(reqOperLogDto: ReqOperLogDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      title,
      operName,
      businessType,
      status,
      params,
    } = reqOperLogDto

    const where: any = {}
    if (title) {
      where.title = Like(`%${title}%`)
    }
    if (operName) {
      where.operName = Like(`%${operName}%`)
    }
    if (businessType) {
      where.businessType = businessType
    }
    if (status) {
      where.status = status
    }
    if (params?.beginTime && params?.endTime) {
      where.operTime = Between(
        new Date(params.beginTime),
        new Date(params.endTime),
      )
    }

    const [rows, total] = await this.operLogRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: {
        id: 'DESC',
      },
    })

    return { rows, total }
  }

  /**
   * 删除
   */
  async remove(ids: number[]) {
    return await this.operLogRepository.delete({ id: In(ids) })
  }

  /**
   * 清空
   */
  async clean() {
    return await this.operLogRepository.clear()
  }

  /**
   * 详情
   */
  async detail(id: number) {
    return await this.operLogRepository.findOne({ where: { id } })
  }
}
