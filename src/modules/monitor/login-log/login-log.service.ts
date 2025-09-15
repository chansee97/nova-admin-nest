import { Injectable } from '@nestjs/common'
import { In, Like } from 'typeorm'
import { ReqLoginLogDto } from './dto/req-login-log.dto'
import { Between } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoginLog } from './entities/login-log.entity'

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(LoginLog)
    private loginLogRepository: Repository<LoginLog>,
  ) {}

  /**
   * 增加
   */
  async create(loginLog: Partial<LoginLog>) {
    return await this.loginLogRepository.save(loginLog)
  }

  /**
   * 查询
   */
  async list(reqLoginLogDto: ReqLoginLogDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      userName,
      ipaddr,
      status,
      params,
    } = reqLoginLogDto

    const where: any = {}
    if (userName) {
      where.userName = Like(`%${userName}%`)
    }
    if (ipaddr) {
      where.ipaddr = Like(`%${ipaddr}%`)
    }
    if (status) {
      where.status = status
    }
    if (params?.beginTime && params?.endTime) {
      where.loginTime = Between(
        new Date(params.beginTime),
        new Date(params.endTime),
      )
    }

    const [rows, total] = await this.loginLogRepository.findAndCount({
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
    return await this.loginLogRepository.delete({ id: In(ids) })
  }

  /**
   * 清空
   */
  async clean() {
    return await this.loginLogRepository.clear()
  }

  /**
   * 详情
   */
  async detail(id: number) {
    return await this.loginLogRepository.findOne({ where: { id } })
  }
}
