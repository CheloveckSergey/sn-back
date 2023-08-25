import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsUserService } from './posts.service';
import { CreatePostUserDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('postUser')
export class PostUserController {

  constructor(private postUserService: PostsUserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/createPostUser')
  @UseInterceptors(FileInterceptor('img'))
  createPostUser(@Body() { description }: { description: string },
  @Req() req,
  @UploadedFile() file: Express.Multer.File) {
    return this.postUserService.createPost(description, file, req.userPayload.id)
  }

  @Get('/getAllPostByUserId/:id')
  getAllPostByUserId(@Param('id') id: number) {
    return this.postUserService.getAllPostByUserId(id);
  }
}
