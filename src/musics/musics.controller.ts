import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicsService } from './musics.service';

@Controller('musics')
export class MusicsController {

  constructor(
    private musicsService: MusicsService,
  ) {}

  @Get('/getAll')
  async getAll() {
    return this.musicsService.getAll();
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() dto: { musicName: string, musicianName: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.musicsService.create(dto.musicName, file, dto.musicianName);
  }

}
