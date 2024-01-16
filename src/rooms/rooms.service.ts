import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './rooms.model';
import { RoomMember, RoomMemberType } from './room-members.model';
import { RoomType } from './rooms.model';
import { Op } from 'sequelize';
import { Message } from 'src/messages/messages.model';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/users.model';
import { ImageService, MyImage } from 'src/service/image.service';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class RoomsService {

  constructor(
    @InjectModel(Room) private roomRep: typeof Room,
    @InjectModel(RoomMember) private roomMemberRep: typeof RoomMember,
    private messagesService: MessagesService,
    private imageService: ImageService,
    private friendsService: FriendsService,
  ) {}

  async getRoomById(id: number) {
    const room = await this.roomRep.findOne({
      where: {
        id
      },
      include: [
        {
          model: RoomMember,
          as: 'roomMembers',
          include: [
            {
              model: User,
              as: 'user',
            }
          ]
        }
      ]
    });
    return room;
  }

  async getPersonalRoom(userId1: number, userId2: number) {
    const candidates = await this.roomRep.findAll({
      where: {
        type: 'personal',
      }, 
      include: [
        {
          model: RoomMember,
          as: 'roomMembers',
        }
      ]
    });
    const rightRoom = candidates.find(room => {
      const userMember1 = room.roomMembers.find(roomMember => roomMember.userId == userId1);
      const userMember2 = room.roomMembers.find(roomMember => roomMember.userId == userId2);
      if (userMember1 && userMember2) {
        return true;
      } else {
        return false;
      }
    });
    return rightRoom;
  }

  async getRoomMember(userId: number, roomId: number) {
    const roomMember = await this.roomMemberRep.findOne({
      where: {
        userId,
        roomId,
      }
    });
    return roomMember;
  }

  async getAllRoomsByUserId(id: number) {
    const roomMembers = await this.roomMemberRep.findAll({
      where: {
        userId: id,
      }
    });
    if (!roomMembers?.length) {
      return [];
    }
    const rooms = await this.roomRep.findAll({
      where: {
        id: {
          [Op.or]: roomMembers.map(roomMember => roomMember.roomId)
        }
      },
      include: [
        {
          model: Message,
          as: 'messages',
          order: [
            ['createdAt', 'DESC'],
          ],
          limit: 1,
        },
        {
          model: RoomMember,
          as: 'roomMembers',
          include: [
            {
              model: User,
              as: 'user',
            }
          ]
        }
      ]
    });
    return rooms;
  }

  async getAllMembersByRoom(roomId: number) {
    const roomMembers = await this.roomMemberRep.findAll({
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
    return roomMembers;
  }

  async getAllPossibleMembers(roomId: number, userId: number) {
    const friends = await this.friendsService.getFriendsByUserId(userId);
    const roomMembers = await this.getAllMembersByRoom(roomId);
    const possibleMembers = friends.filter(friend => {
      for (let roomMember of roomMembers) {
        if (roomMember.userId === friend.id) {
          return false;
        }
      }
      return true;
    });
    return possibleMembers;
  }

  async createRoom(userId: number, type: RoomType, name?: string, avatar?: Express.Multer.File) {
    let image: MyImage | undefined;
    if (avatar) {
      image = this.imageService.createMyImage(avatar);
    }
    const room = await this.roomRep.create({
      type,
      name,
      avatar: image?.name,
    });
    image?.save();
    const roomMember = await this.roomMemberRep.create({
      userId: userId,
      roomId: room.id,
      type: 'admin',
    });
    const _room = await this.getRoomById(room.id);
    return _room;
  }

  async createGeneralRoom(adminId: number, name: string, userIds: number[], avatar?: Express.Multer.File) {
    const _room = await this.createRoom(adminId, 'general', name, avatar);
    
    userIds.forEach(async (userId) => {
      await this.addRoomMember(userId, _room.id);
    });
    const room = await this.getRoomById(_room.id);
    return room;
  }

  async createPersonalRoom(userId1: number, userId2: number) {
    const candidate = await this.getPersonalRoom(userId1, userId2);
    if (candidate) {
      throw new HttpException('Такая комнатка уже существует', HttpStatus.BAD_REQUEST);
    }

    const _room = await this.roomRep.create({
      type: 'personal',
    });
    const roomMember1 = await this.roomMemberRep.create({
      userId: userId1,
      roomId: _room.id,
      type: 'admin',
    });
    const roomMember2 = await this.roomMemberRep.create({
      userId: userId2,
      roomId: _room.id,
      type: 'admin',
    });
    const room = await this.getRoomById(_room.id);
    return room;
  }

  async createPRoomAndWMessage(userId1: number, userId2: number, text: string) {
    const _room = await this.createPersonalRoom(userId1, userId2);
    const room = await this.getRoomById(_room.id);
    const message = await this.messagesService.createMessage(userId1, room.id, text);
    return room;
  }

  async addRoomMember(userId: number, roomId: number) {
    const candidate = await this.roomMemberRep.findOne({
      where: {
        userId,
        roomId,
      }
    });
    if (candidate) {
      throw new HttpException('Данный пользователь уже состоит в данной комнате', HttpStatus.BAD_REQUEST);
    }

    const roomMember = await this.roomMemberRep.create({
      userId,
      roomId,
      type: 'user',
    });
    return roomMember;
  }

  async addRoomMembers(userIds: number[], roomId: number) {
    const roomMembers = await Promise.allSettled(userIds.map(userId => this.addRoomMember(userId, roomId)));
    return roomMembers;
  }

  async updateRoomMember(userId: number, type: RoomMemberType, roomId: number) {
    const candidate = await this.roomMemberRep.findOne({
      where: {
        userId,
        roomId,
      }
    });
    if (!candidate) {
      throw new HttpException('Данного пользователя нет в данной комнате', HttpStatus.BAD_REQUEST);
    }

    await candidate.update({type});
    return candidate;
  }

  async deleteRoomMember(userId: number, roomId: number) {
    const candidate = await this.getRoomMember(userId, roomId);
    if (!candidate) {
      throw new HttpException('Данный пользователь не состоит в данной комнате', HttpStatus.BAD_REQUEST);
    }

    await candidate.destroy();
  }

  async deleteRoom(roomId: number) {
    const room = await this.getRoomById(roomId);
    await room.destroy();
    return { message: 'Данный член удалён... член, ха ха' };
  }
}
