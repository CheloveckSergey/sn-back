import { Module } from '@nestjs/common';
import { PULikesController } from './likes.controller';
import { PULikeService } from './likes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostUserLike } from './likes.model';

@Module({
  controllers: [PULikesController],
  providers: [PULikeService],
  imports: [
    SequelizeModule.forFeature([PostUserLike]),
  ],
  exports: [
    PULikeService,
  ]
})
export class LikesModule {}
