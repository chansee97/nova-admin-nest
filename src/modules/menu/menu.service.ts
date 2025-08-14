import type { Repository } from 'typeorm'
import type { CreateMenuDto } from './dto/create-menu.dto'
import type { UpdateMenuDto } from './dto/update-menu.dto'
import type { SearchQuery } from '@/common/dto/page.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiErrorCode } from '@/common/enum'
import { ApiException } from '@/common/filters'
import { Menu } from './entities/menu.entity'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const menuName = createMenuDto.menuName
    const existMenu = await this.menuRepository.findOne({
      where: { menuName },
    })

    if (existMenu)
      throw new ApiException('菜单已存在', ApiErrorCode.SERVER_ERROR)

    await this.menuRepository.save(createMenuDto)
    return '菜单新增成功'
  }

  async findAll(searchQuery: SearchQuery) {
    let skip = 0
    let take = 0

    if (searchQuery.pageNum && searchQuery.pageSize) {
      skip = (searchQuery.pageNum - 1) * searchQuery.pageSize
      take = searchQuery.pageSize
    }

    const [list, total] = await this.menuRepository.findAndCount({
      skip,
      take,
    })
    return {
      list,
      total,
    }
  }

  async findOne(id: number) {
    const existData = await this.menuRepository.findOne({
      where: { id },
    })

    if (!existData)
      throw new ApiException('操作对象不存在', ApiErrorCode.SERVER_ERROR)

    return existData
  }

  async update(updateMenuDto: UpdateMenuDto) {
    const { id } = updateMenuDto
    await this.findOne(id)

    await this.menuRepository.update(id, updateMenuDto)

    return '更新成功'
  }

  async remove(id: number) {
    await this.findOne(id)

    await this.menuRepository.delete(id)
    return '删除成功'
  }
}
