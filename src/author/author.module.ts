import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from './author.model';
import { GroupModule } from 'src/group/group.module';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
  imports: [
    SequelizeModule.forFeature([Author]),
  ],
  exports: [
    AuthorService,
  ]
})
export class AuthorModule {}
