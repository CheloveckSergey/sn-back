import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AlbumImagesService } from './album-images.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('album-images')
export class AlbumImagesController {

  constructor(private imagesService: AlbumImagesService) {}

  @Get('/getAllImagesByAlbum/:id')
  async getAllImagesByUserId(
    @Param('id') albumId: number
  ) {
    return this.imagesService.getAllImagesByAlbumId(albumId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @UseInterceptors(FileInterceptor('img'))
  async createImageByUserId(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body() dto: {albumId: number, authorId: number}
  ) {
    return this.imagesService.create(dto.albumId, dto.authorId, file);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('/createByUserId')
  // @UseInterceptors(FileInterceptor('img'))
  // async createImageByUserId(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Req() req,
  // ) {
  //   return this.imagesService.createImageByUserId(req.userPayload.id, file);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('/createByGroupId')
  // @UseInterceptors(FileInterceptor('img'))
  // async createImageByGroupId(
  //   @Body() {groupId} : {groupId: number},
  //   @UploadedFile() file: Express.Multer.File,
  //   @Req() req,
  // ) {
  //   return this.imagesService.createImageByUserId(groupId, file);
  // }

  // @Get('/getAllImagesByUserId/:id')
  // async getAllImagesByUserId(
  //   @Param('id') userId: number
  // ) {
  //   return this.imagesService.getAllImagesByUserId(userId);
  // }

  // @Get('/getAllImagesByGroupId/:id')
  // async getAllImagesByGroupId(
  //   @Param('id') groupId: number
  // ) {
  //   return this.imagesService.getAllImagesByGroupId(groupId);
  // }
}
