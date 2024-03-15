import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Musician } from './musicians.model';
import { ImageService, MyImage } from 'src/service/image.service';

@Injectable()
export class MusiciansService {

  constructor(
    @InjectModel(Musician) private musicianRep: typeof Musician,
    private imageService: ImageService,
  ) {}

  async getById(id: number) {
    const musician = await this.musicianRep.findByPk(id);
    return musician;
  }

  async getByName(name: string) {
    const musician = await this.musicianRep.findOne({
      where: {
        name,
      }
    });
    return musician;
  }

  async create(name: string, image?: Express.Multer.File) {
    const candidate = await this.getByName(name);
    if (candidate) {
      throw new HttpException('Такой музыкант уже существует', HttpStatus.BAD_REQUEST);
    }
    let myImage: MyImage;
    if (image) {
      myImage = new MyImage(image);
    }
    const musician = await this.musicianRep.create({
      name,
      image: myImage?.name,
    });
    myImage?.save();
    return musician;
  } 

  async updateAvatar(musicianId: number, imageFile: Express.Multer.File) {
    if (!imageFile) {
      throw new HttpException("Нет изображения", HttpStatus.BAD_REQUEST);
    }
    const myImage: MyImage = new MyImage(imageFile);
    const _musician = await this.musicianRep.update({image: myImage.name}, {
      where: {
        id: musicianId,
      }
    });
    myImage.save();
    const musician = await this.getById(musicianId);
    return musician;
  }
}
