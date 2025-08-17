import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Menu } from './entities/menu.entity'
import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [TypeOrmModule.forFeature([Menu])],
})
export class MenuModule {}
