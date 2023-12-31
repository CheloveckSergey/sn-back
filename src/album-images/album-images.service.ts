import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AlbumImage } from './album-images.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { CreationsService } from 'src/creations/creations.service';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { Creation } from 'src/creations/creations.model';

@Injectable()
export class AlbumImagesService {

  constructor(
    @InjectModel(AlbumImage) private imageRep: typeof AlbumImage,
    private creationsService: CreationsService,
  ) {}

  async getImageById(id: number) {
    const image = await this.imageRep.findOne({
      where: {
        id,
      },
      include: [
        Creation,
      ]
    });
    return image;
  }

  // async getOneImageByImage(userId: number, albumImage: AlbumImage) {
  //   const oneCreation = await this.creationsService.getOneCreationByCreation(userId, albumImage.creation);
  //   const onePostImage: OnePostImage = {
  //     id: postImage.id,
  //     value: postImage.value,
  //     postId: postImage.postId,
  //     creationId: postImage.creationId,
  //     creation: oneCreation,
  //   }
  //   return onePostImage;
  // }

  async getAllImagesByAlbumId(albumId: number) {
    const images = await this.imageRep.findAll({
      where: {
        albumId,
      },
      include: [
        Creation,
      ]
    });
    return images;
  }

  async create(albumId: number, authorId: number, file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Нет файла нахуй', HttpStatus.BAD_REQUEST);
    }

    const imageName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', imageName), file.buffer);
    
    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.ALBUM_IMAGE);
    const response = await this.imageRep.create({value: imageName, albumId, creationId: creation.id});
    return response;
  }

  async deleteImageById(id: number) {
    const image = await this.getImageById(id);
    const creation = await this.creationsService.getCreationById(image.creationId);
    await creation.destroy();
    await image.destroy();
    return {message: 'Удалено успешно'};
  }
}
