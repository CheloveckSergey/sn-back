import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FriendRequest } from './friend-requests.model';
import { User } from 'src/users/users.model';
import { FriendsService } from './friends.service';

@Injectable()
export class FriendRequestsService {

  constructor(
    @InjectModel(FriendRequest) private friendRequestsRep: typeof FriendRequest,
    private friendsService: FriendsService,
  ) {}

  // async getRequestById(id: number) {
  //   const request = await this.friendRequestsRep.findOne({
  //     where: {
  //       id,
  //     },
  //     include: [
  //       {
  //         model: User,
  //         as: 'user1',
  //       },
  //       {
  //         model: User,
  //         as: 'user2',
  //       }
  //     ]
  //   });
  //   return request;
  // }

  // async getRequestByUsers(userId1: number, userId2: number) {
  //   const request = await this.friendRequestsRep.findOne({
  //     where: {
  //       userId1,
  //       userId2,
  //     },
  //     include: [
  //       {
  //         model: User,
  //         as: 'user1',
  //       },
  //       {
  //         model: User,
  //         as: 'user2',
  //       }
  //     ]
  //   });
  //   return request;
  // }

  // async createRequest(userId1: number, userId2: number) {
  //   const alreadyFriends = await this.friendsService.isFriend(userId1, userId2);
  //   if (alreadyFriends) {
  //     throw new HttpException('Пользователи уже дружат', HttpStatus.BAD_REQUEST);
  //   }

  //   const candidate = await this.getRequestByUsers(userId1, userId2);
  //   if (candidate) {
  //     throw new HttpException('Такая заявка от пользователя ' + candidate.user1.login + ' уже отправлялась', HttpStatus.BAD_REQUEST);
  //   }

  //   await this.friendRequestsRep.destroy({
  //     where: {
  //       userId1: userId2,
  //       userId2: userId1,
  //     }
  //   });

  //   const _request = await this.friendRequestsRep.create({userId1, userId2});
  //   const request = await this.getRequestById(_request.id);
  //   return request; 
  // }

  // async rejectRequest(requestId: number) {
  //   const request = await this.getRequestById(requestId);
  //   if (request.rejected) {
  //     throw new HttpException('Заявка уже отклонена', HttpStatus.BAD_REQUEST)
  //   }
  //   if (request.accepted) {
  //     throw new HttpException('Заявка уже принята', HttpStatus.BAD_REQUEST)
  //   }
  //   await request.update('rejected', true);
  //   request.save();
  //   return request;
  // }

  // async acceptRequest(requestId: number) {
  //   const request = await this.getRequestById(requestId)
  //   if (request.rejected) {
  //     throw new HttpException('Заявка уже отклонена', HttpStatus.BAD_REQUEST)
  //   }
  //   if (request.accepted) {
  //     throw new HttpException('Заявка уже принята', HttpStatus.BAD_REQUEST)
  //   } 
  //   await this.friendsService.createFriendship(request.userId1, request.userId2);
  // }

  // async deleteRequestById(id: number) {
  //   const request = await this.getRequestById(id);
  //   if (!request) {
  //     throw new HttpException('Такой заявки и так нет', HttpStatus.BAD_REQUEST);
  //   } 

  //   await request.destroy();
  //   return { message: 'Заявка удалена' }
  // }

  // async deleteAllBetweenUsers(userId1: number, userId2: number) {
  //   const request1 = await this.getRequestByUsers(userId1, userId2);
  //   if (request1) {
  //     await request1.destroy();
  //   }
  //   const request2 = await this.getRequestByUsers(userId2, userId1);
  //   if (request2) {
  //     await request2.destroy();
  //   }
  // }
}
