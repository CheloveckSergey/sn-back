import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './group.model';
import { UsersService } from 'src/users/users.service';
import { GroupDesc } from './group-desc.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { AuthorService, _Author } from 'src/author/author.service';
import { AuthorTypeCodes } from 'src/author/author-types.model';
import { GMTypes, GroupMember } from './group-members.model';

type _Group = {
  id: number,
  name: string,
  avatar: string | undefined,
  adminId: number,
  author: _Author,
}

@Injectable()
export class GroupService {

  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(GroupDesc) private groupDescRepository: typeof GroupDesc,
    @InjectModel(GroupMember) private groupMembersRep: typeof GroupMember,
    private authorService: AuthorService,
  ) {}

  async getAllGroups() {
    const allGroups = await this.groupRepository.findAll();
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
        name,
      }
    });
    return group;
  }

  // async getGroupByName(name: string, curUserId?: number) {
  //   const group = await this.groupRepository.findOne({
  //     where: {
  //       name
  //     },
  //   });
  //   const author = await this.authorService.getAuthorByGroupId(group.id, curUserId);
  //   let _group: _Group = {
  //     id: group.id,
  //     name: group.name,
  //     avatar: group.avatar,
  //     adminId: group.adminId,
  //     author: author,
  //   };
  //   return _group;
  // }

  // async getAdminGroupsByUserId(userId: number) {
  //   const groups = await this.groupRepository.findAll({
  //     where: {
  //       adminId: userId,
  //     },
  //     include: {
  //       all: true
  //     }
  //   });
  //   return groups;
  // }

  async createGroup(userId: number, name: string, avatarFile: Express.Multer.File) {
    const candidate = await this.getGroupByName(name);
    if (candidate) {
      throw new HttpException('Группа с таким именем уже существует', HttpStatus.BAD_REQUEST);
    }

    let imageName: string | null;
    if (avatarFile) {
      imageName = uuid.v4() + '.jpg';
      await writeFile(path.resolve('src', 'static', imageName), avatarFile.buffer);
    } else {
      imageName = null;
    }
    const author = await this.authorService.createAuthor(name, AuthorTypeCodes.GROUP, imageName);
    const group = await this.groupRepository.create({name, avatar: imageName, authorId: author.id});
    const group_members = await this.groupMembersRep.create({
      groupId: group.id, userId: userId, gmType: GMTypes.ADMIN,
    });
    return {message: 'Группа создана'};
  }

  // async createGroup(userId: number, name: string, imageFile: Express.Multer.File) {
  //   if (!name) {
  //     return {message: 'Нет названия группы'}
  //   }
  //   const allGroups = await this.getAllGroups();
  //   const candidate = allGroups.find(group => group.name === name);
  //   if (candidate) {
  //     throw new HttpException('Такая группа уже существует', HttpStatus.BAD_REQUEST);
  //   }
  //   let imageName;
  //   if (imageFile) {
  //     imageName = uuid.v4() + '.jpg';
  //     await writeFile(path.resolve('src', 'static', imageName), imageFile.buffer);
  //   } else {
  //     imageName = null;
  //   }
  //   const group = await this.groupRepository.create({adminId: userId, name, avatar: imageName});
  //   const description = await this.groupDescRepository.create({groupId: group.id});
  //   const author = await this.authorService.createAuthor({name: group.name, authorType: 'group', authorId: group.id});
  //   await this.authorService.updateAvatar(imageName, author.id);
  //   return group;
  // }

  // async deleteGroupById(id: number, userId: number) {
  //   const group = await this.getGroupById(id);
  //   if (group.adminId !== userId) {
  //     throw new HttpException('У вас нет прав нахуй!', HttpStatus.BAD_REQUEST);
  //   }
  //   const response = await this.groupRepository.destroy({
  //     where: {
  //       id
  //     }
  //   });
  //   return response;
  // }

  // async getAllSubsByGroupId(groupId: number) {
  //   const group = await this.groupRepository.findOne({
  //     where: {
  //       id: groupId,
  //     },
  //     include: {
  //       all: true,
  //     }
  //   });
  //   return group.subscribers;
  // }

  // async getSubsByGroupId(groupId: number) {
  //   const author = await this.authorService.getAuthorByGroupId(groupId);
  //   const subs = await this.authorService.getSubscribersByAuthorId(author.id);
  //   return subs;
  // }

  async createAvatar(userId: number, name: string, file: Express.Multer.File) {
    const avatarName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', avatarName), file.buffer);
    await this.groupRepository.update(
      {avatar: avatarName},
      {
        where: {
          name
        }
      }
    );
    const group = await this.getGroupByName(name);
    await this.authorService.updateAvatar(avatarName, group.author.id);
    return {message: 'Ну вроде нормал'};
  }
}
