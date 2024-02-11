import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Payload } from 'src/auth/dto/auth.dto';

type CrBody = {
  authorId: number,
  text: string,
  creationId: number,
  responseToCommentId?: number,
}

@Controller('comments')
export class CommentsController {

  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/getCommentsToCreationId/:id')
  async getCommentsToCreationId(
    @Param('id') creationId: number,
    @Req() req: {userPayload: Payload}
  ) {
    return this.commentsService.getAllCommentsToCreationId(req.userPayload.id, creationId);
  }

  // @Get('/getCommentsByPostId/:postId')
  // async getCommentsByPostId(
  //   @Param('postId') postId: number
  // ) {
  //   return this.commentsService.getCommentsByPostId(postId);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/createComment')
  async createComment(
    @Body() dto: CrBody,
    @Req() req: {userPayload: Payload},
  ) {
    console.log(dto);
    return this.commentsService.createComment(req.userPayload.id, dto.authorId, dto.text, dto.creationId, dto.responseToCommentId);
  }

  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('img'))
  // @Post('/createPostComment')
  // async createPostComment(
  //   @Body() crBody: CrBody,
  //   @Req() req,
  // ) {
  //   return this.commentsService.createComment(req.userPayload.id, crBody.text, 'post', crBody.creationId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('/createGroupPost')
  // @UseInterceptors(FileInterceptor('img'))
  // createPostGroup(@Body() body,
  // @Req() req,
  // @UploadedFile() file: Express.Multer.File) {
  //   console.log('comController');
  //   console.log(body);
  //   return 'lololo';
  // }
}
