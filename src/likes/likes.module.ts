import { Module } from '@nestjs/common';
import { PULikesController } from './likes.controller';
import { PULikeService } from './likes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostLike } from './likes.model';

@Module({
  controllers: [PULikesController],
  providers: [PULikeService],
  imports: [
    SequelizeModule.forFeature([PostLike]),
  ],
  exports: [
    PULikeService,
  ]
})
export class LikesModule {}
