import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AlbumImage, OneAlbumImage } from './album-images.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { CreationsService } from 'src/creations/creations.service';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { Creation } from 'src/creations/creations.model';
import { Op } from 'sequelize';
import { AlbumsService } from 'src/albums/albums.service';
import { Album } from 'src/albums/albums.model';
import { Author } from 'src/author/author.model';
import { Comment } from 'src/comments/comments.model';
import { Like } from 'src/likes/likes.model';

@Injectable()
export class AlbumImagesService {

  constructor(
    @InjectModel(AlbumImage) private imageRep: typeof AlbumImage,
    private creationsService: CreationsService,
    private albumService: AlbumsService,
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

  async getAllAlbumImagesByAuthor(authorId: number, meUserId: number) {
    const albumImagesCreations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.ALBUM_IMAGE, authorId);

    if (!albumImagesCreations.length) {
      return [];
    }

    const images = await this.imageRep.findAll({
      where: {
        creationId: {
          [Op.or]: albumImagesCreations.map(creation => creation.id),
        }
      },
      include: [
        {
          model: Creation,
          as: 'creation',
          include: [
            {
              model: Author,
              as: 'author',
            },
            {
              model: Comment,
              as: 'comments',
            },
            {
              model: Like,
              as: 'likes',
            }
          ],
        }
      ]
    });

    const oneImages = await Promise.all(images.map(image => {
      return this.getOneImageByImage(meUserId, image);
    }));
    return oneImages;
  }

  async getOneImageByImage(meUserId: number, albumImage: AlbumImage): Promise<OneAlbumImage> {
    const oneCreation = await this.creationsService.getOneCreationByCreation(meUserId, albumImage.creation);
    const oneImage: OneAlbumImage = {
      id: albumImage.id,
      value: albumImage.value,
      albumId: albumImage.albumId,
      creationId: oneCreation.id,
      creation: oneCreation,
    }
    return oneImage;
  }

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

  async create(authorId: number, file: Express.Multer.File, userId: number, albumId?: number) {
    if (!file) {
      throw new HttpException('Нет файла нахуй', HttpStatus.BAD_REQUEST);
    }

    const imageName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', imageName), file.buffer);

    let _albumId: number;
    if (!albumId) {
      const album = await this.albumService.getAlbumByName('general', authorId);
      _albumId = album.id;
      if (!album) {
        const album = await this.albumService.createAlbum(authorId, 'general', userId);
        _albumId = album.id;
      }
    } else {
      const album = await this.albumService.getAlbumById(albumId);
      _albumId = album.id;
    }
    
    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.ALBUM_IMAGE);
    const response = await this.imageRep.create({value: imageName, albumId: _albumId, creationId: creation.id});
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
