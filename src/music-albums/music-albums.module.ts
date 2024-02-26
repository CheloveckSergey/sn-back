import { Module } from '@nestjs/common';
import { MusicAlbumsController } from './music-albums.controller';
import { MusicAlbumsService } from './music-albums.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MusicAlbum } from './music-albums.model';

@Module({
  controllers: [MusicAlbumsController],
  providers: [MusicAlbumsService],
  imports: [
    SequelizeModule.forFeature([MusicAlbum]),
  ]
})
export class MusicAlbumsModule {}
