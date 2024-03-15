import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MusiciansService } from './musicians.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('musicians')
export class MusiciansController {

  constructor(private musiciansService: MusiciansService) {}

  @Get('/getById/:id')
  async getById(
    @Param('id') musicianId: number
  ) {
    return this.musiciansService.getById(musicianId);
  }

  @Post('/updateAvatar')
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateAvatar(
    @Body() dto: { musicianId: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.musiciansService.updateAvatar(dto.musicianId, file);
  }
}
