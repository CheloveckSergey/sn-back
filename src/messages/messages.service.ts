import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { User } from 'src/users/users.model';
import { Room } from 'src/rooms/rooms.model';
import { MReadHistoryService } from 'src/m-read-history/m-read-history.service';
import { Gateway } from 'src/gateway/gateway';

export interface _Message {
  id: number,
  text: string,
  user: User,
  userId: number,
  roomId: number,
  room: Room,
  createdAt?: any,
  updatedAt?: any,
  read: boolean,
}

@Injectable()
export class MessagesService {

  constructor(
    @InjectModel(Message) private messagesRep: typeof Message,
    private mReadHistoryService: MReadHistoryService,
    // private gateway: Gateway,
  ) {}

  async getMessageById(id: number): Promise<_Message> {
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
    //Хорошо бы здесь попробовать сделать, чтобы это поле подгружалось автоматически
    const _message = await this.mapMessage(message);
    return _message;
  }

  async getMessagesByRoomId(roomId: number): Promise<_Message[]> {
    const messages = await this.messagesRep.findAll({
      where: {
        roomId,
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
    const _messages = await Promise.all(messages.map(message => this.mapMessage(message)));
    return _messages;
  }

  async getAllUnreadMessages(userId: number): Promise<_Message[]> {
    const statuses = await this.mReadHistoryService.getAllUnreadByUserId(userId);
    const _messages = await Promise.all(statuses.map(async status => await this.getMessageById(status.messageId)));

    return _messages;
  }

  async createMessage(userId: number, roomId: number, text: string): Promise<_Message> {
    const message = await this.messagesRep.create({
      userId, roomId, text
    });
    const newMessage = await this.getMessageById(message.id);
    return newMessage;
  }

  async deleteMessageById(id: number) {
    const message = await this.messagesRep.findByPk(id);
    if (!message) {
      throw new HttpException('Такого сообщения не существует ебать его в рот', HttpStatus.BAD_REQUEST);
    }
    await this.mReadHistoryService.deleteAllStatusesByMessage(id);
    await message.destroy();
    return {message: 'Удалено так сказац'};
  }

  async mapMessage(message: Message): Promise<_Message> {
    const read = await this.mReadHistoryService.checkStatus(message.id, message.userId);
    const _message = {
      ...message.dataValues,
      read,
    }
    return _message;
  }
}
