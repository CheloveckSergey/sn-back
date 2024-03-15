import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MusicsService } from './musics.service';

@Controller('musics')
export class MusicsController {

  constructor(
    private musicsService: MusicsService,
  ) {}

  @Get('/getAll')
  async getAll(
    @Query('authorId') authorId: number,
  ) {
    return this.musicsService.getAll(authorId);
  }

  @Get('/getAllByMusician/:musicianId')
  async getAllByMusician(
    @Param('musicianId') musicianId: number,
  ) {
    return this.musicsService.getAllByMusician(musicianId);
  }

  @Get('/getAllAddedMusic/:authorId')
  async getAllAddedMusic(
    @Param('authorId') authorId: number,
  ) {
    return this.musicsService.getAllAddedMusic(authorId);
  }

  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]))
  async create(
    @Body() dto: { musicName: string, musicianName: string, albumId?: number, },
    @UploadedFiles() files: { music?: Express.Multer.File, image?: Express.Multer.File },
  ) {
    return this.musicsService.create(dto.musicName, files.music[0], dto.musicianName, dto.albumId, files.image[0]);
  }

  @Post('/addMusicToAdded')
  async addMusicToAdded(
    @Body() dto: { authorId: number, musicId: number }
  ) {
    return this.musicsService.addMusicToAdded(dto.musicId, dto.authorId);
  }

  @Post('/deleteMusicFromAdded')
  async deleteMusicFromAdded(
    @Body() dto: { authorId: number, musicId: number }
  ) {
    return this.musicsService.deleteMusicFromAdded(dto.musicId, dto.authorId);
  }

  @Delete('/delete/:id')
  async delete(
    @Param('id') id: number,
  ) {
    return this.musicsService.delete(id);
  }
}
