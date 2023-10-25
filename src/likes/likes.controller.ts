import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {

  constructor(private likesService: LikesService) {}

  // @Get('/getByPostId/:id')
  // async getByPostId(
  //   @Param('id') id: number
  // ) {
  //   return this.puLikeService.getAllPULikesByPostId(id);
  // }

  // @Get('/getByUserId/:id')
  // async getByUserId(
  //   @Param('id') id: number
  // ) {
  //   return this.puLikeService.getAllPULikesByUserId(id);
  // }

  @Get('/getByCreationId/:id')
  async getByCreationId(
    @Param('id') creationId: number
  ) {
    return this.likesService.getLikesByCreationId(creationId);
  }
  
  @Post('/createLike')
  async createtLike(
    @Body() dto: {userId: number, creationId: number}
  ) {
    return this.likesService.createLike(dto.userId, dto.creationId);
  }

  @Post('/deleteLike')
  async deleteLike(
    @Body() dto: {userId: number, creationId: number}
  ) {
    return this.likesService.deleteLike(dto.userId, dto.creationId);
  }
}
