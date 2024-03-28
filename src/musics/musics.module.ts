import { Module } from '@nestjs/common';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Music } from './musics.model';
import { MusiciansModule } from 'src/musicians/musicians.module';
import { ServiceModule } from 'src/service/service.module';
import { AddedMusicList } from 'src/added-music-lists/added-music-lists.model';
import { AMLMusic } from 'src/added-music-lists/aml-musics.model';
import { AddedMusicListsModule } from 'src/added-music-lists/added-music-lists.module';
import { MusicPost } from './music-post.model';

@Module({
  controllers: [MusicsController],
  providers: [MusicsService],
  imports: [
    SequelizeModule.forFeature([Music, AddedMusicList, AMLMusic, MusicPost,]),
    MusiciansModule,
    ServiceModule,
    AddedMusicListsModule,
  ],
  exports: [
    MusicsService,
  ]
})
export class MusicsModule {}
