import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Album } from './albums.model';
import { CreationsService } from 'src/creations/creations.service';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { Op } from 'sequelize';
import { Creation } from 'src/creations/creations.model';

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

  async createAlbum(authorId: number, name: string) {
    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.ALBUM);
    const album = await this.albumRep.create({creationId: creation.id, name});
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
