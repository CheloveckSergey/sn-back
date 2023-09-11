import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

type CrBody = {
  text: string,
  creationId: number
}

@Controller('comments')
export class CommentsController {

  constructor(private commentsService: CommentsService) {}

  @Get('/getCommentsByImageId/:imageId')
  async getCommentsByImageId(
    @Param('imageId') imageId: number
  ) {
    return this.commentsService.getCommentsByImageId(imageId);
  }

  @Get('/getCommentsByPostId/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: number
  ) {
    return this.commentsService.getCommentsByPostId(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createImageComment')
  async createImageComment(
    @Body() crBody: CrBody,
    @Req() req,
  ) {
    console.log('imageController');
    return this.commentsService.createComment(req.userPayload.id, crBody.text, 'image', crBody.creationId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  @Post('/createPostComment')
  async createPostComment(
    @Body() crBody: CrBody,
    @Req() req,
  ) {
    return this.commentsService.createComment(req.userPayload.id, crBody.text, 'post', crBody.creationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createGroupPost')
  @UseInterceptors(FileInterceptor('img'))
  createPostGroup(@Body() body,
  @Req() req,
  @UploadedFile() file: Express.Multer.File) {
    console.log('comController');
    console.log(body);
    return 'lololo';
  }
}
