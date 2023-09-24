import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './images.model';
import { AuthorModule } from 'src/author/author.module';
import { UsersModule } from 'src/users/users.module';
import { GroupModule } from 'src/group/group.module';
import { AuthorService } from 'src/author/author.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    SequelizeModule.forFeature([Image]),
    AuthorModule,
  ],
})
export class ImagesModule {}
