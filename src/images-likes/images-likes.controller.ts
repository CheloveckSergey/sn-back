import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ImagesLikesService } from './images-likes.service';
import { ReqILikeDto } from './dto';

@Controller('images-likes')
export class ImagesLikesController {

  constructor(private iLikeService: ImagesLikesService) {}

  @Get('/getByImageId/:id')
  async getByPostId(
    @Param('id') id: number
  ) {
    return this.iLikeService.getAllILikesByImageId(id);
  }

  @Get('/getByUserId/:id')
  async getByUserId(
    @Param('id') id: number
  ) {
    return this.iLikeService.getAllILikesByUserId(id);
  }

  @Post('/createImageLike')
  async createPostLike(
    @Body() dto: ReqILikeDto
  ) {
    return this.iLikeService.createILike(dto.userId, dto.imageId);
  }

  @Post('/deleteImageLike')
  async deletePostLike(
    @Body() dto: ReqILikeDto
  ) {
    return this.iLikeService.deleteILike(dto.userId, dto.imageId);
  }
}
