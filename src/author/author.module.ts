import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './author.model';
import { Author_Subs } from './author-subs.model';
import { AuthorType } from './author-types.model';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
  imports: [
    SequelizeModule.forFeature([
      Author, 
      Author_Subs,
      AuthorType,
    ]),
  ],
  exports: [
    AuthorService,
  ]
})
export class AuthorModule {}
