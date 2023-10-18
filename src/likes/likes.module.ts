import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LikesController } from './likes.controller';
import { Like } from './likes.model';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [
    SequelizeModule.forFeature([
      Like,
    ]),
  ],
  exports: [
    LikesService,
  ]
})
export class LikesModule {}
