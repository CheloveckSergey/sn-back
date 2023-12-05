import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { User } from 'src/users/users.model';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/rooms.model';

@Injectable()
export class MessagesService {

  constructor(
    @InjectModel(Message) private messagesRep: typeof Message,
  ) {}

  async getMessageById(id: number) {
    const message = await this.messagesRep.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Room,
          as: 'room',
        }
      ]
    });
    return message;
  }

  async getMessagesByRoomId(roomId: number) {
    const messages = await this.messagesRep.findAll({
      where: {
        roomId,
      },
      include: [
        {
          model: User,
          as: 'user',
        }
      ]
    });
    return messages;
  }

  async createMessage(userId: number, roomId: number, text: string) {
    const message = await this.messagesRep.create({
      userId, roomId, text
    });
    const newMessage = await this.getMessageById(message.id);
    return newMessage;
  }

  async deleteMessageById(id: number) {
    const message = await this.getMessageById(id);
    if (!message) {
      throw new HttpException('Такого сообщения не существует ебать его в рот', HttpStatus.BAD_REQUEST);
    }

    await message.destroy();
  }
}
