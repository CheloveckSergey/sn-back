import { Module } from '@nestjs/common';
import { AlbumImagesController } from './album-images.controller';
import { AlbumImagesService } from './album-images.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumImage } from './album-images.model';
import { CreationsModule } from 'src/creations/creations.module';

@Module({
  controllers: [AlbumImagesController],
  providers: [AlbumImagesService],
  imports: [
    SequelizeModule.forFeature([AlbumImage]),
    CreationsModule,
  ],
})
export class ImagesModule {}
