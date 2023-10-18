import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostsController {

  constructor(private postsService: PostsService) {}

  @Get('/getAllPostByAuthorId/:id')
  getAllPostByUserId(@Param('id') authorId: number) {
    return this.postsService.getAllPostsByAuthorId(authorId);
  }

  // @Get('/getFeedByUserId/:id')
  // getFeed(@Param('id') userId: number) {
  //   return this.postsService.getAllPostsByAuthorId(authorId);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/createPost')
  @UseInterceptors(FileInterceptor('img'))
  createPostUser(@Body() { description, authorId }: { description: string, authorId: number },
  @Req() req,
  @UploadedFile() files: Express.Multer.File[]) {
    return this.postsService.createPostByAuthor(description, files, authorId);
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
  // @UseGuards(JwtAuthGuard)
  // @Post('/createGroupPost')
  // @UseInterceptors(FileInterceptor('img'))
  // createPostGroup(@Body() body: { description: string, groupName: string },
  // @Req() req,
  // @UploadedFile() file: Express.Multer.File) {
  //   console.log(body);
  //   return this.postUserService.createPostByGroup(body.description, file, body.groupName, req.userPayload.id)
  // }

  // @Get('/getAllPostByUserId/:id')
  // getAllPostByUserId(@Param('id') id: number) {
  //   return this.postUserService.getAllPostByUserId(id);
  // }

  // @Get('/getAllPostByGroupName/:name')
  // getAllPostByGroupName(@Param('name') groupName: string) {
  //   return this.postUserService.getAllPostsByGroupName(groupName);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('/getFeed')
  // getFeedByUserId(
  //   @Req() req,
  // ) {
  //   return this.postUserService.getFeedByUserId(req.userPayload.id);
  // }
}
