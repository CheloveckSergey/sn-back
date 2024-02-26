import { Module } from '@nestjs/common';
import { AddedMusicListsController } from './added-music-lists.controller';
import { AddedMusicListsService } from './added-music-lists.service';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddedMusicList } from './added-music-lists.model';
import { AMLMusic } from './aml-musics.model';

@Module({
  controllers: [AddedMusicListsController],
  providers: [AddedMusicListsService],
  imports: [
    SequelizeModule.forFeature([AddedMusicList, AMLMusic]),
  ]
})
export class AddedMusicListsModule {}
