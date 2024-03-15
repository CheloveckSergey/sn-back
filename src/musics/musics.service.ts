import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Music, OneMusic } from './musics.model';
import { MusiciansService } from 'src/musicians/musicians.service';
import { Musician } from 'src/musicians/musicians.model';
import { MyMusic } from 'src/service/music.service';
import { MyImage } from 'src/service/image.service';
import { AddedMusicList } from 'src/added-music-lists/added-music-lists.model';
import { AddedMusicListsService } from 'src/added-music-lists/added-music-lists.service';

@Injectable()
export class MusicsService {

  constructor(
    @InjectModel(Music) private musicRep: typeof Music,
    @InjectModel(Music) private addedMusicListRep: typeof AddedMusicList,
    private musiciansService: MusiciansService,
    private addedMusicListsService: AddedMusicListsService,
  ) {}

  async getById(id: number) {
    const music = await this.musicRep.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Musician,
          as: 'musician',
        }
      ]
    });
    return music;
  }

  async getAll(authorId: number) {
    const musics = await this.musicRep.findAll({
      include: [
        {
          model: Musician,
          as: 'musician',
        }
      ]
    });
    const oneMusics = await Promise.all(musics.map(async (music) => {
      return this.getOneMusicByMusic(music, authorId);
    }))
    return oneMusics;
  }

  async getAllByMusician(musicianId: number) {
    const musics = await this.musicRep.findAll({
      include: [
        {
          model: Musician,
          as: 'musician',
        }
      ],
      where: {
        musicianId,
      }
    });
    
    return musics;
  }

  async getAllAddedMusic(authorId: number): Promise<OneMusic[]> {
    const musics = await this.addedMusicListsService.getAllAddedMusic(authorId);
    const oneMusics = await Promise.all(musics.map(async (music) => this.getOneMusicByMusic(music, authorId)));
    return oneMusics;
  }

  async addMusicToAdded(musicId: number, authorId: number) {
    const music = await this.getById(musicId);
    if (!music) {
      throw new HttpException('Такой музыки нифига нет', HttpStatus.BAD_REQUEST);
    }
    let addedMusicList = await this.addedMusicListsService.getByAuthor(authorId);
    if (!addedMusicList) {
      addedMusicList = await this.addedMusicListsService.create(authorId);
    }
    addedMusicList.$add('musics', music);
    return music;
  }

  async deleteMusicFromAdded(musicId: number, authorId: number) {
    const music = await this.getById(musicId);
    if (!music) {
      throw new HttpException('Такой музыки нифига нет', HttpStatus.BAD_REQUEST);
    }
    let addedMusicList = await this.addedMusicListsService.getByAuthor(authorId);
    if (!addedMusicList) {
      throw new HttpException('У этого пользователя даже нет листа добавленной музыки блять', HttpStatus.BAD_REQUEST);
    }
    const isAdded: boolean = await this.addedMusicListsService.isMusicAdded(musicId, authorId);
    if (!isAdded) {
      throw new HttpException('Эту музыка не добавлена', HttpStatus.BAD_REQUEST);
    }
    addedMusicList.$remove('musics', music);
    return music;
  }

  async getOneMusicByMusic(music: Music, authorId: number): Promise<OneMusic> {
    const addedMusic = await this.addedMusicListsService.getAllAddedMusic(authorId);
    const candidate = addedMusic.find(addedMusic => addedMusic.id === music.id);
    const oneMusic: OneMusic = {
      id: music.id,
      name: music.name,
      value: music.value,
      image: music.image,
      musicianId: music.musicianId,
      musician: music.musician,
      albumId: music.albumId,
      album: music.album,
      added: candidate ? true : false,
    }
    return oneMusic;
  }

  async create(
    musicName: string, 
    musicFile: Express.Multer.File, 
    musicianName: string, 
    albumId?: number,
    imageFile?: Express.Multer.File, 
  ) {
    let musician: Musician = await this.musiciansService.getByName(musicianName);
    if (!musician) {
      musician = await this.musiciansService.create(musicianName);
    }
    if (!musicFile) {
      throw new HttpException('Нет файла', HttpStatus.BAD_REQUEST);
    }
    let myMusic: MyMusic = new MyMusic(musicFile);
    let myImage: MyImage | undefined;
    if (imageFile) {
      myImage = new MyImage(imageFile);
    }
    const _music = await this.musicRep.create({
      name: musicName, 
      value: myMusic.name, 
      musicianId: musician.id, 
      albumId,
      image: myImage?.name,
    });
    myMusic.save();
    myImage?.save();
    const music = await this.getById(_music.id);
    return music;
  }

  async delete(id: number) {
    const candidate = await this.musicRep.findByPk(id);
    if (!candidate) {
      throw new HttpException('Такой музыки нет', HttpStatus.BAD_REQUEST);
    }
    MyMusic.delete(candidate.value);
    if (candidate.image) {
      MyImage.delete(candidate.image);
    }
    await this.musicRep.destroy({
      where: {
        id,
      }
    });
    return candidate;
  }
}
