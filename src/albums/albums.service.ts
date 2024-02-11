import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Album, OneAlbum } from './albums.model';
import { CreationsService } from 'src/creations/creations.service';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { Op } from 'sequelize';
import { Creation } from 'src/creations/creations.model';
import { AlbumImage, OneAlbumImage } from 'src/album-images/album-images.model';
import { Author } from 'src/author/author.model';
import { Comment } from 'src/comments/comments.model';
import { Like } from 'src/likes/likes.model';

@Injectable()
export class AlbumsService {

  constructor(
    @InjectModel(Album) private albumRep: typeof Album,
    private creationsService: CreationsService,
  ) {}

  async getAlbumById(id: number) {
    const album = await this.albumRep.findOne({
      where: {
        id,
      },
      include: [
        Creation,
      ]
    });
    return album;
  }

  async getOneAlbumById(id: number, userId: number): Promise<OneAlbum> {
    const _album = await this.albumRep.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Creation,
          as: 'creation',
        },
        {
          model: AlbumImage,
          as: 'images',
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
                  model: Like,
                  as: 'likes',
                },
                {
                  model: Comment,
                  as: 'comments',
                }
              ]
            }
          ]
        }
      ]
    });
    const album: OneAlbum = await this.getAlbumWithOneImagesByAlbumWithImages(_album, userId);
    return album;
  }

  async getAllAlbumsByAuthorId(authorId: number) {
    const creations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.ALBUM, authorId);
    if (!creations) {
      return [];
    }
    const albums = await this.albumRep.findAll({
      where: {
        creationId: {
          [Op.or]: creations.map(creation => creation.id),
        }
      },
      include: [
        Creation,
      ]
    });
    return albums;
  }

  async getAllAlbumsWithOneImagesByAuthorId(authorId: number, userId: number): Promise<OneAlbum[]> {
    const creations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.ALBUM, authorId);
    if (!creations) {
      return [];
    }
    const albums = await this.albumRep.findAll({
      where: {
        creationId: {
          [Op.or]: creations.map(creation => creation.id),
        }
      },
      include: [
        {
          model: Creation,
          as: 'creation',
        },
        {
          model: AlbumImage,
          as: 'images',
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
                  model: Like,
                  as: 'likes',
                },
                {
                  model: Comment,
                  as: 'comments',
                }
              ]
            }
          ]
        }
      ]
    });
    const oneAlbums: OneAlbum[] = await Promise.all(albums.map(album => this.getAlbumWithOneImagesByAlbumWithImages(album, userId)));
    return oneAlbums;
  }

  async getAlbumWithOneImagesByAlbumWithImages(album: Album, userId: number): Promise<OneAlbum> {
    const oneImages = await Promise.all(album.images.map(image => this.getOneImageByImage(userId, image)));
    const oneAlbum: OneAlbum = {
      ...album.dataValues,
      images: oneImages,
    }
    return oneAlbum;
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

  async getAlbumByName(name: string, authorId: number): Promise<Album | null> {
    const creations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.ALBUM, authorId);
    if (!creations) {
      return null;
    }

    const album = await this.albumRep.findOne({
      where: {
        name,
        creationId: {
          [Op.or]: creations.map(creation => creation.id),
        },
      }
    });
    return album;
  }

  async createAlbum(authorId: number, name: string, userId: number) {
    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.ALBUM);
    const _album = await this.albumRep.create({creationId: creation.id, name});
    const album = await this.getOneAlbumById(_album.id, userId);
    return album;
  }

  async deleteAlbumById(id: number) {
    const album = await this.getAlbumById(id);
    const creation = await this.creationsService.getCreationById(album.creationId);
    await creation.destroy();
    await album.destroy();
    return {message: 'Удалено успешно'};
  }
}
