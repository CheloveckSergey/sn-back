import { Module, forwardRef } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendRequestsService } from './friend-requests.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FriendRequest } from './friend-requests.model';
import { FriendsService } from './friends.service';
import { User_Friend } from './user-friends.model';
import { UsersModule } from 'src/users/users.module';
import { AuthorModule } from 'src/author/author.module';

@Module({
  controllers: [FriendsController],
  providers: [FriendRequestsService, FriendsService],
  imports: [
    SequelizeModule.forFeature([
      FriendRequest,
      User_Friend,
    ]),
    UsersModule,
    AuthorModule,
  ],
  exports: [
    FriendsService,
  ]
})
export class FriendsModule {}
