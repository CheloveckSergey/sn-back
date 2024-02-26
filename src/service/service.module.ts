import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { MusicService } from './music.service';

@Module({
  providers: [
    ImageService,
    MusicService,
  ],
  exports: [
    ImageService,
    MusicService,
  ]
})
export class ServiceModule {}
