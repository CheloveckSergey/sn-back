import { Body, Controller, Get, Param, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
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
  @UseInterceptors(FilesInterceptor('img'))
  createPost(
    @Body() { description, authorId }: { description: string, authorId: number },
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log("CREATE_POST_CONTROLLER");
    console.log("AUTHOR_ID: " + authorId + ' ' + typeof authorId);
    console.log(files);
    return this.postsService.createPostByAuthor(description, files, Number(authorId));
    // return {message: 'Иди нахуй'};
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
