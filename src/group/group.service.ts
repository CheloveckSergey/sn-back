import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './group.model';
import { UsersService } from 'src/users/users.service';
import { GroupDesc } from './group-desc.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';

@Injectable()
export class GroupService {

  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(GroupDesc) private groupDescRepository: typeof GroupDesc,
    private userService: UsersService
  ) {}

  async getAllGroups() {
    const allGroups = await this.groupRepository.findAll({
      include: {
        all: true
      }
    });
    return allGroups;
  }

  async getGroupById(id: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id
      },
      include: {
        all: true
      }
    });
    return group;
  }

  async getGroupByName(name: string) {
    const group = await this.groupRepository.findOne({
      where: {
        name
      },
      include: {
        all: true
      }
    });
    return group;
  }

  async getAdminGroupsByUserId(userId: number) {
    const groups = await this.groupRepository.findAll({
      where: {
        adminId: userId,
      },
      include: {
        all: true
      }
    });
    return groups;
  }

  async createGroup(userId: number, name: string, imageFile: Express.Multer.File) {
    if (!name) {
      return {message: 'Нет названия группы'}
    }
    const allGroups = await this.getAllGroups();
    const candidate = allGroups.find(group => group.name === name);
    if (candidate) {
      throw new HttpException('Такая группа уже существует', HttpStatus.BAD_REQUEST);
    }
    let imageName;
    if (imageFile) {
      imageName = uuid.v4() + '.jpg';
      await writeFile(path.resolve('src', 'static', imageName), imageFile.buffer);
    } else {
      imageName = null;
    }
    const group = await this.groupRepository.create({adminId: userId, name, avatar: imageName});
    const description = await this.groupDescRepository.create({groupId: group.id});
    // return group.$set('description', [description.id]);
  }

  async deleteGroupById(id: number, userId: number) {
    const group = await this.getGroupById(id);
    if (group.adminId !== userId) {
      throw new HttpException('У вас нет прав нахуй!', HttpStatus.BAD_REQUEST);
    }
    const response = await this.groupRepository.destroy({
      where: {
        id
      }
    });
    return response;
  }

  async getAllSubsByGroupId(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      include: {
        all: true,
      }
    });
    return group.subscribers;
  }

  async subscribe(userId: number, groupId: number) {
    const subscribers = await this.getAllSubsByGroupId(groupId);
    const candidate = subscribers.find(subscriber => subscriber.id === userId);
    if (candidate) {
      throw new HttpException('Подписка уже оформлена', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserById(userId);
    user.$set('subGroups', [groupId]);
    return {message: 'Ну вроде подписался'};
  }

  async unsubscribe(userId: number, groupId: number) {
    const subscribers = await this.getAllSubsByGroupId(groupId);
    const candidate = subscribers.find(subscriber => subscriber.id === userId);
    if (!candidate) {
      throw new HttpException('Данный юзер не подписан на данную группу', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserById(userId);
    user.$remove('subGroups', [groupId]);
    return {message: 'Ну вроде отписался'};
  }
}
