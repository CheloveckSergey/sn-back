import { Module } from '@nestjs/common';
import { PostsUserService } from './posts.service';
import { PostUserController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostUser } from './posts.model';
import { UsersModule } from 'src/users/users.module';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  providers: [PostsUserService],
  controllers: [PostUserController],
  imports: [
    SequelizeModule.forFeature([PostUser]),
    UsersModule,
    LikesModule,
  ],
})
export class PostUserModule {}
