import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { User } from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import { Roles } from "./roles/roles.model";
import { UserRoles } from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from "./auth/refreshTokens.model";
import { PostUserModule } from './posts/posts.module';
import { Post } from "./posts/posts.model";
import { UserDescModule } from './user-desc/user-desc.module';
import { UserDesc } from "./user-desc/user-desc.model";
import { LikesModule } from './likes/likes.module';
import { PostLike } from "./likes/likes.model";
import { GroupModule } from './group/group.module';
import { Group } from "./group/group.model";
import { GroupSubscriber } from "./group/group-subscriber.model";
import { GroupDesc } from "./group/group-desc.model";
import { GroupModerator } from "./group/group-moderator.mode";
import { AuthorModule } from './author/author.module';
import { Author } from "./author/author.model";
import { ImagesModule } from './images/images.module';
import { Image } from "./images/images.model";
import { ImagesLikesModule } from './images-likes/images-likes.module';
import { ImageLike } from "./images-likes/images-likes.model";
import { CommentsModule } from './comments/comments.module';
import { Comment } from "./comments/comments.model";
import { Author_Subs } from "./author/author-subs.model";


@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'David_2102',
      database: 'sn',
      models: [User, 
        Roles, 
        UserRoles, 
        RefreshToken, 
        Post, 
        UserDesc, 
        PostLike, 
        Group, 
        GroupSubscriber, 
        GroupDesc, 
        GroupModerator, 
        Author, 
        Image, 
        ImageLike,
        Comment,
        Author_Subs,
      ],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    RefreshToken,
    PostUserModule,
    UserDescModule,
    LikesModule,
    GroupModule,
    AuthorModule,
    ImagesModule,
    ImagesLikesModule,
    CommentsModule,
  ]
})
export class AppModule {}