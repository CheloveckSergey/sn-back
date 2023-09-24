import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('author')
export class AuthorController {

  constructor(private authorService: AuthorService) {}

  @Get('/getAuthorByName/:name')
  async getAuthorByName(
    @Param('name') name: string
  ) {
    return this.authorService.getAuthorByName(name);
  }

  @Get('/getAuthorByNameWithAll/:name')
  async getAuthorByNameWithAll(
    @Param('name') name: string
  ) {
    return this.authorService.getAuthorByName(name);
  }

  @Get('/getAuthorById/:id')
  async getAuthorById(
    @Param('id') id: number
  ) {
    return this.authorService.getAuthorById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/subscribe/:authorId')
  async subscribe(
    @Param('authorId') authorId: number,
    @Req() req,
  ) {
    return this.authorService.subscribe(req.userPayload.id, authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/unsubscribe/:authorId')
  async unsubscribe(
    @Param('authorId') authorId: number,
    @Req() req,
  ) {
    return this.authorService.unsubscribe(req.userPayload.id, authorId);
  }
}
