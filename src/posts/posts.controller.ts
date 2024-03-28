import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Payload } from 'src/auth/dto/auth.dto';

@Controller('posts')
export class PostsController {

  constructor(private postsService: PostsService) {}

  @Get('/getAllPostByAuthorId/:id')
  getAllPostByUserId(@Param('id') authorId: number) {
    return this.postsService.getAllPostsByAuthorId(authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllOnePostsByAuthorId/:id')
  getAllOnePostsByAuthorId(
    @Param('id') authorId: number,
    @Req() req: {userPayload: Payload},
  ) {
    return this.postsService.getAllOnePostsByAuthorId(req.userPayload.id, authorId);
  }

  // @Get('/getFeedByUserId/:id')
  // getFeed(@Param('id') userId: number) {
  //   return this.postsService.getAllPostsByAuthorId(authorId);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/createPost')
  @UseInterceptors(FilesInterceptor('img'))
  createPost(
    @Body() dto: { description: string, authorId: number, musicIds: number[] },
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('\n\n\n\n');
    console.log(dto);
    return this.postsService.createPostByAuthor(dto.description, files, Number(dto.authorId), dto.musicIds);
    // return {message: 'Иди нахуй'};
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createRepost')
  createRepost(
    @Body() { repostId, authorId }: { repostId: number, authorId: number },
  ) {
    console.log("\n\nCREATE_REPOST_CONTROLLER");
    return this.postsService.createRepost(repostId, authorId);
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
  @UseGuards(JwtAuthGuard)
  @Get('/getFeedByAuthorId/:authorId')
  getFeedByUserId(
    @Param('authorId') authorId: number,
    @Req() req: { userPayload: Payload },
    @Query() query: { offset?: number, limit?: number },
  ) {
    return this.postsService.getFeedByAuthorId(authorId, req.userPayload.id, query);
  }
}
