import { Module } from '@nestjs/common';
import { PostImagesController } from './post-images.controller';
import { PostImagesService } from './post-images.service';
import { CreationsModule } from 'src/creations/creations.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostImage } from './post-images.model';

@Module({
  controllers: [PostImagesController],
  providers: [PostImagesService],
  imports: [
    SequelizeModule.forFeature([
      PostImage,
    ]),
    CreationsModule,
  ],
  exports: [PostImagesService],
})
export class PostImagesModule {}
