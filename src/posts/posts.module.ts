import { Module } from '@nestjs/common';
import { PostsUserService } from './posts.service';
import { PostUserController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { UsersModule } from 'src/users/users.module';
import { LikesModule } from 'src/likes/likes.module';
import { AuthorModule } from 'src/author/author.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  providers: [PostsUserService],
  controllers: [PostUserController],
  imports: [
    SequelizeModule.forFeature([Post]),
    UsersModule,
    LikesModule,
    AuthorModule,
    GroupModule,
  ],
})
export class PostUserModule {}
