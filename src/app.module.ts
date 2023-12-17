import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AlbumImage } from "./album-images/album-images.model";
import { ImagesModule } from "./album-images/album-images.module";
import { Album } from "./albums/albums.model";
import { AlbumsModule } from "./albums/albums.module";
import { RefreshToken } from "./auth/refreshTokens.model";
import { AuthModule } from "./auth/auth.module";
import { Author_Subs } from "./author/author-subs.model";
import { AuthorType } from "./author/author-types.model";
import { Author } from "./author/author.model";
import { AuthorModule } from "./author/author.module";
import { Comment } from "./comments/comments.model";
import { CommentsModule } from "./comments/comments.module";
import { CreationType } from "./creations/creation-types.model";
import { Creation } from "./creations/creations.model";
import { CreationsModule } from "./creations/creations.module";
import { GMType } from "./group/gmTypes.model";
import { GroupDesc } from "./group/group-desc.model";
import { GroupMember } from "./group/group-members.model";
import { Group } from "./group/group.model";
import { GroupModule } from "./group/group.module";
import { Like } from "./likes/likes.model";
import { LikesModule } from "./likes/likes.module";
import { PostImage } from "./post-images/post-images.model";
import { PostImagesModule } from "./post-images/post-images.module";
import { Post } from "./posts/posts.model";
import { PostModule } from "./posts/posts.module";
import { Roles } from "./roles/roles.model";
import { UserRoles } from "./roles/user-roles.model";
import { RolesModule } from "./roles/roles.module";
import { UserDesc } from "./user-desc/user-desc.model";
import { UserDescModule } from "./user-desc/user-desc.module";
import { User_Friend } from "./users/user-friends.model";
import { User } from "./users/users.model";
import { UsersModule } from "./users/users.module";
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';
import { Message } from "./messages/messages.model";
import { Room } from "./rooms/rooms.model";
import { RoomMember } from "./rooms/room-members.model";
import { GatewayModule } from './gateway/gateway.module';
import { ServiceModule } from './service/service.module';
import { MReadHistoryModule } from './m-read-history/m-read-history.module';
import { MReadHistory } from "./m-read-history/m-read-history.model";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'David_2102',
      database: 'sn3',
      models: [
        AlbumImage,
        Album,
        RefreshToken,
        Author_Subs,
        AuthorType,
        Author,
        Comment,
        CreationType,
        Creation,
        GMType,
        GroupDesc,
        GroupMember,
        Group,
        Like,
        PostImage,
        Post,
        Roles,
        UserRoles,
        UserDesc,
        User_Friend,
        User,
        Message,
        Room,
        RoomMember,
        MReadHistory,
      ],
      autoLoadModels: true,
    }),
    ImagesModule,
    AlbumsModule,
    AuthModule,
    AuthorModule,
    CommentsModule,
    CreationsModule,
    GroupModule,
    LikesModule,
    PostImagesModule,
    PostModule,
    RolesModule,
    UserDescModule,
    UsersModule,
    MessagesModule,
    RoomsModule,
    GatewayModule,
    ServiceModule,
    MReadHistoryModule,
  ]
})
export class AppModule {}