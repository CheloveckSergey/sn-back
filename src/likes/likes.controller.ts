import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PULikeService } from './likes.service';
import { PULikeReqDto } from './dto';

@Controller('postLikes')
export class PULikesController {

  constructor(private puLikeService: PULikeService) {}

  @Get('/getByPostId/:id')
  async getByPostId(
    @Param('id') id: number
  ) {
    return this.puLikeService.getAllPULikesByPostId(id);
  }

  @Get('/getByUserId/:id')
  async getByUserId(
    @Param('id') id: number
  ) {
    return this.puLikeService.getAllPULikesByUserId(id);
  }

  @Post('/createPostLike')
  async createPostLike(
    @Body() dto: PULikeReqDto
  ) {
    return this.puLikeService.createPULike(dto);
  }

  @Post('deletePostLike')
  async deletePostLike(
    @Body() dto: PULikeReqDto
  ) {
    return this.puLikeService.deletePULike(dto);
  }
}
