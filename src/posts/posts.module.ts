import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { CreationsModule } from 'src/creations/creations.module';
import { PostImagesModule } from 'src/post-images/post-images.module';
import { PostsService } from './posts.service';
import { AuthorModule } from 'src/author/author.module';
import { UsersModule } from 'src/users/users.module';
import { MusicsModule } from 'src/musics/musics.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [
    SequelizeModule.forFeature([Post]),
    CreationsModule,
    PostImagesModule,
    AuthorModule,
    UsersModule,
    MusicsModule,
  ],
})
export class PostModule {}
