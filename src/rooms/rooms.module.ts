import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './rooms.model';
import { RoomMember } from './room-members.model';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [
    SequelizeModule.forFeature([
      Room,
      RoomMember,
    ]),
    MessagesModule,
  ],
  exports: [
    RoomsService,
  ]
})
export class RoomsModule {}
