import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { RoomsService } from 'src/rooms/rooms.service';
import { MessagesService } from 'src/messages/messages.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MessagesModule } from 'src/messages/messages.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  providers: [
    Gateway
  ],
  imports: [
    RoomsModule,
    MessagesModule,
    CommentsModule,
  ]
})
export class GatewayModule {}
