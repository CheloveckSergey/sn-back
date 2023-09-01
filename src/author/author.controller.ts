import { Controller, Get, Param } from '@nestjs/common';
import { AuthorService } from './author.service';

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
    return this.authorService.getAuthorByNameWithAll(name);
  }

  @Get('/getAuthorByName/:id')
  async getAuthorById(
    @Param('id') id: number
  ) {
    return this.authorService.getAuthorById(id);
  }
}
