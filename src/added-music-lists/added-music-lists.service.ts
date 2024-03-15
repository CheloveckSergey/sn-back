import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddedMusicList } from './added-music-lists.model';
import { Music } from 'src/musics/musics.model';
import { Musician } from 'src/musicians/musicians.model';

@Injectable()
export class AddedMusicListsService {

  constructor(@InjectModel(AddedMusicList) private addedMusicListRep: typeof AddedMusicList) {}

  async getById(id: number) {
    const addedMusicList = await this.addedMusicListRep.findByPk(id);
    return addedMusicList;
  }

  async getByAuthor(authorId: number) {
    const addedMusicList = await this.addedMusicListRep.findOne({
      where: {
        authorId,
      }
    });
    return addedMusicList;
  }

  async getAllAddedMusic(authorId: number) {
    const addedMusicList = await this.addedMusicListRep.findOne({
      where: {
        authorId,
      },
      include: [
        {
          model: Music,
          as: 'musics',
          include: [
            {
              model: Musician,
              as: 'musician',
            }
          ]
        }
      ]
    });
    if (addedMusicList) {
      return addedMusicList.musics;
    } else {
      return [];
    }
  }

  async create(authorId: number) {
    const candidate = await this.getByAuthor(authorId);
    if (candidate) {
      throw new HttpException('У этого автора уже есть лист добавленной музыки', HttpStatus.BAD_REQUEST);
    }
    const addedMusicList = await this.addedMusicListRep.create({authorId});
    return addedMusicList;
  }

  async isMusicAdded(musicId: number, authorId: number): Promise<boolean> {
    const allAddedMusic = await this.getAllAddedMusic(authorId);
    const candidate = allAddedMusic.find(addedMusic => addedMusic.id === musicId);
    if (candidate) {
      return true
    } else {
      return false;
    }
  }
}
