import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthorTypeCodes, AuthorTypeNames } from './author-types.model';

@Controller('author')
export class AuthorController {

  constructor(private authorService: AuthorService) {}

  // @Get('/getAuthorByName/:name')
  // async getAuthorByName(
  //   @Param('name') name: string
  // ) {
  //   return this.authorService.getAuthorByName(name);
  // }

  // @Get('/getAuthorByNameWithAll/:name')
  // async getAuthorByNameWithAll(
  //   @Param('name') name: string
  // ) {
  //   return this.authorService.getAuthorByName(name);
  // }

  @Get('/getAuthorById/:id')
  async getAuthorById(
    @Param('id') id: number
  ) {
    return this.authorService.getAuthorById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/subscribe')
  async subscribe(
    @Body() dto: {
      authorId: number,
      userId: number,
    }
  ) {
    return this.authorService.subscribe(dto.userId, dto.authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/unsubscribe')
  async unsubscribe(
    @Body() dto: {
      authorId: number,
      userId: number,
    }
  ) {
    return this.authorService.unsubscribe(dto.userId, dto.authorId);
  }

  @Get('/getSubsByAuthorId/:authorId')
  async getSubsByAuthorId(
    @Param('authorId') authorId: number
  ) {
    return this.authorService.getSubscribersByAuthorId(authorId);
  }

  @Post('/createType')
  async createType(
    @Body() dto: { code: AuthorTypeCodes, name: AuthorTypeNames },
  ) {
    return this.authorService.createAuthorType(dto.code, dto.name);
  }
}
