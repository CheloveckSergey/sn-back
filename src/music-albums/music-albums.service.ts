import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Music } from 'src/musics/musics.model';
import { MusicAlbum } from './music-albums.model';

@Injectable()
export class MusicAlbumsService {

  constructor(
    @InjectModel(MusicAlbum) private musicAlbumRep: typeof MusicAlbum,
  ) {}

  async getAllMusic() {
    const musics = await this.musicAlbumRep.findAll();
    return musics;
  }
  
}
