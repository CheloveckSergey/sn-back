import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {

  constructor(private messagesService: MessagesService) {}

  @Get('/getAllUnread/:userId')
  async getAllUnread(
    @Param('userId') userId: number,
  ) {
    return this.messagesService.getAllUnreadMessages(userId);
  }

  @Get('/getMessagesByRoom/:roomId')
  async getMessagesByRoom(
    @Param('roomId') roomId: number,
  ) {
    return this.messagesService.getMessagesByRoomId(roomId);
  }
}
