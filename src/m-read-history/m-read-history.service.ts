import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MReadHistory } from './m-read-history.model';
import { Message } from 'src/messages/messages.model';

@Injectable()
export class MReadHistoryService {

  constructor(@InjectModel(MReadHistory) private mReadHistoryRep: typeof MReadHistory) {}

  async getStatusById(id: number) {
    const status = await this.mReadHistoryRep.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Message,
          as: 'message',
        }
      ],
    });
    return status;
  }

  async getStatus(messageId: number, userId: number) {
    const status = await this.mReadHistoryRep.findOne({
      where: {
        userId,
        messageId,
      }
    });
    return status;
  }

  async getAllUnreadByUserId(userId: number) {
    const allUnread = await this.mReadHistoryRep.findAll({
      where: {
        userId,
        status: false,
      },
      include: [
        {
          model: Message,
          as: 'message',
        }
      ],
    });
    return allUnread;
  }

  async createStatus(messageId: number, userId: number) {
    const _status = await this.mReadHistoryRep.create({
      userId, 
      messageId,
    });
    const status = await this.getStatusById(_status.id);
    return status;
  }

  async createAllStatusesByMessage(messageId: number, userIds: number[]) {
    for (let userId of userIds) {
      await this.createStatus(messageId, userId);
    }
    return;
  }

  async changeStatus(statusId: number, val: boolean) {
    await this.mReadHistoryRep.update({
      status: val,
    }, {
      where: {
        id: statusId,
      }
    });
    const newStatus = await this.getStatusById(statusId);
    return newStatus;
  }

  async readMessage(messageId: number, userId: number) {
    const status = await this.getStatus(messageId, userId);
    const newStatus = await this.changeStatus(status.id, true);
    return newStatus;
  }
}
