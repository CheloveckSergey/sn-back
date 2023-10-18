import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {

  constructor(private albumsService: AlbumsService) {}

  @Get('/getAlbum/:id')
  async getAlbum(
    @Param('id') albumId,
  ) {
    return this.albumsService.getAlbumById(albumId);
  }

  @Post('/createAlbum')
  async createAlbum(
    @Body() dto: {authorId: number, name: string}
  ) {
    return this.albumsService.createAlbum(dto.authorId, dto.name);
  }
}
