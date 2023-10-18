import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Album } from './albums.model';
import { CreationsService } from 'src/creations/creations.service';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { Op } from 'sequelize';

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
      }
    });
    return album;
  }

  async getAllAlbumsByAuthorId(authorId: number) {
    const creations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.ALBUM, authorId);
    const albums = await this.albumRep.findAll({
      where: {
        creationId: {
          [Op.or]: creations.map(creation => creation.id),
        }
      }
    });
    return albums;
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
