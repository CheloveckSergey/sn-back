import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { User } from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import { Roles } from "./roles/roles.model";
import { UserRoles } from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from "./auth/refreshTokens.model";
import { PostUserModule } from './userPosts/posts.module';
import { PostUser } from "./userPosts/posts.model";
import { UserDescModule } from './user-desc/user-desc.module';
import { UserDesc } from "./user-desc/user-desc.model";
import { LikesModule } from './likes/likes.module';
import { PostUserLike } from "./likes/likes.model";
import { GroupModule } from './group/group.module';
import { Group } from "./group/group.model";
import { GroupSubscriber } from "./group/group-subscriber.model";
import { GroupDesc } from "./group/group-desc.model";
import { GroupModerator } from "./group/group-moderator.mode";
import { AuthorModule } from './author/author.module';


@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'David_2102',
      database: 'nest_study',
      models: [User, Roles, UserRoles, RefreshToken, PostUser, UserDesc, PostUserLike, Group, GroupSubscriber, GroupDesc, GroupModerator],
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
  ]
})
export class AppModule {}