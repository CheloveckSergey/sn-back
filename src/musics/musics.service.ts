import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Music } from './musics.model';
import { MusiciansService } from 'src/musicians/musicians.service';
import { Musician } from 'src/musicians/musicians.model';
import { MyMusic } from 'src/service/music.service';
import { MyImage } from 'src/service/image.service';

@Injectable()
export class MusicsService {

  constructor(
    @InjectModel(Music) private musicRep: typeof Music,
    private musiciansService: MusiciansService,
  ) {}

  async getAll() {
    const musics = await this.musicRep.findAll({
      include: [
        {
          model: Musician,
          as: 'musician',
        }
      ]
    });
    return musics;
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
    let myImage: MyImage;
    if (imageFile) {
      myImage = new MyImage(imageFile);
    }
    const music = await this.musicRep.create({
      name: musicName, 
      value: myMusic.name, 
      musicianId: musician.id, 
      albumId,
      image: myImage?.name,
    });
    myMusic.save();
    myImage?.save();
    return music;
  }
}
