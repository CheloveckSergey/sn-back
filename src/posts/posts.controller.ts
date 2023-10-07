import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsUserService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostUserController {

  constructor(private postUserService: PostsUserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/createPostUser')
  @UseInterceptors(FileInterceptor('img'))
  createPostUser(@Body() { description }: { description: string },
  @Req() req,
  @UploadedFile() file: Express.Multer.File) {
    return this.postUserService.createPostByUser(description, file, req.userPayload.id)
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('/createGroupPost')
  // @UseInterceptors(FileInterceptor('img'))
  // createPostGroup(@Body() body,
  // @Req() req,
  // @UploadedFile() file: Express.Multer.File) {
  //   console.log('postController');
  //   console.log(body);
  //   return 'lololo';
  // }
  @UseGuards(JwtAuthGuard)
  @Post('/createGroupPost')
  @UseInterceptors(FileInterceptor('img'))
  createPostGroup(@Body() body: { description: string, groupName: string },
  @Req() req,
  @UploadedFile() file: Express.Multer.File) {
    console.log(body);
    return this.postUserService.createPostByGroup(body.description, file, body.groupName, req.userPayload.id)
  }

  @Get('/getAllPostByUserId/:id')
  getAllPostByUserId(@Param('id') id: number) {
    return this.postUserService.getAllPostByUserId(id);
  }

  @Get('/getAllPostByGroupName/:name')
  getAllPostByGroupName(@Param('name') groupName: string) {
    return this.postUserService.getAllPostsByGroupName(groupName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getFeed')
  getFeedByUserId(
    @Req() req,
  ) {
    return this.postUserService.getFeedByUserId(req.userPayload.id);
  }
}
