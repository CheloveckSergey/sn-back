import { Module } from '@nestjs/common';
import { ImagesLikesController } from './images-likes.controller';
import { ImagesLikesService } from './images-likes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImageLike } from './images-likes.model';

@Module({
  controllers: [ImagesLikesController],
  providers: [ImagesLikesService],
  imports: [
    SequelizeModule.forFeature([
      ImageLike,
    ])
  ]
})
export class ImagesLikesModule {}
