import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './rooms.model';
import { RoomMember } from './room-members.model';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import { ServiceModule } from 'src/service/service.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [
    SequelizeModule.forFeature([
      Room,
      RoomMember,
    ]),
    MessagesModule,
    UsersModule,
    ServiceModule,
    FriendsModule,
  ],
  exports: [
    RoomsService,
  ]
})
export class RoomsModule {}
