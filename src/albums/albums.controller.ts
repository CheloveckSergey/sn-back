import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Payload } from 'src/auth/dto/auth.dto';

@Controller('albums')
export class AlbumsController {

  constructor(private albumsService: AlbumsService) {}

  @Get('/getAlbum/:id')
  async getAlbum(
    @Param('id') albumId: number,
  ) {
    return this.albumsService.getAlbumById(albumId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllAlbumsWithOneImagesByAuthorId/:id')
  async getAllAlbumsWithOneImagesByAuthorId(
    @Param('id') authorId: number,
    @Req() req: {userPayload: Payload},
  ) {
    return this.albumsService.getAllAlbumsWithOneImagesByAuthorId(authorId, req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createAlbum')
  async createAlbum(
    @Body() dto: {authorId: number, name: string},
    @Req() req: {userPayload: Payload},
  ) {
    return this.albumsService.createAlbum(dto.authorId, dto.name, req.userPayload.id);
  }
}
