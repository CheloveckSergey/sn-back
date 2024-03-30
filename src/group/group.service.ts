import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group, OneGroup } from './group.model';
import { UsersService } from 'src/users/users.service';
import { GroupDesc } from './group-desc.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { AuthorService, _Author } from 'src/author/author.service';
import { AuthorType, AuthorTypeCodes } from 'src/author/author-types.model';
import { GMTypes, GroupMember } from './group-members.model';
import { Author, OneAuthor } from 'src/author/author.model';
import { User } from 'src/users/users.model';
import { MyImage } from 'src/service/image.service';

@Injectable()
export class GroupService {

  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(GroupDesc) private groupDescRepository: typeof GroupDesc,
    @InjectModel(GroupMember) private groupMembersRep: typeof GroupMember,
    private authorService: AuthorService,
  ) {}

  async getGroupById(id: number, userId: number): Promise<OneGroup> {
    const group = await this.groupRepository.findOne({
      where: {
        id
      },
      include: [
        {
          model: GroupMember,
          as: 'groupMembers',
        },
        {
          model: Author,
          as: 'author',
        }
      ]
    });
    const oneGroup: OneGroup = await this.getOneGroupByGroup(group, userId);
    return oneGroup;
  }

  async getGroupByName(name: string, userId: number): Promise<OneGroup> {
    const group = await this.groupRepository.findOne({
      where: {
        name,
      },
      include: [
        {
          model: GroupMember,
          as: 'groupMembers',
        },
        {
          model: Author,
          as: 'author',
        }
      ]
    });
    const oneGroup: OneGroup = await this.getOneGroupByGroup(group, userId);
    return oneGroup;
  }
  
  async getAllGroups(userId: number): Promise<OneGroup[]> {
    const allGroups = await this.groupRepository.findAll({
      include: [
        {
          model: GroupMember,
          as: 'groupMembers',
        },
        {
          model: Author,
          as: 'author',
        }
      ]
    });
    const allOneGroups: OneGroup[] = await Promise.all(
      allGroups.map(group => this.getOneGroupByGroup(group, userId))
    )
    return allOneGroups;
  }

  async getOneGroupByGroup(group: Group, userId: number): Promise<OneGroup> {
    if (!group.groupMembers) {
      throw new HttpException('Нет groupMembers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const oneAuthor: OneAuthor = await this.authorService.getOneAuthorByAuthor(userId, group.author);
    const oneGroup: OneGroup = {
      id: group.id,
      name: group.name,
      avatar: group.avatar,
      membersNumber: group.groupMembers.length,
      authorId: group.authorId,
      author: oneAuthor,
    }
    return oneGroup;
  }

  async createGroup(userId: number, name: string, avatarFile: Express.Multer.File | undefined) {
    const candidate = await this.groupRepository.findOne({
      where: {
        name,
      }
    });
    if (candidate) {
      throw new HttpException('Группа с таким именем уже существует', HttpStatus.BAD_REQUEST);
    }

    let myImage: MyImage | undefined; 
    if (avatarFile) {
      myImage = new MyImage(avatarFile)
    }

    const author = await this.authorService.createAuthor(name, AuthorTypeCodes.GROUP, myImage?.name);
    const group = await this.groupRepository.create({name, avatar: myImage?.name, authorId: author.id});
    const group_member = await this.groupMembersRep.create({
      groupId: group.id, userId: userId, gmType: GMTypes.ADMIN,
    });
    myImage?.save();
    return {message: 'Группа создана'};
  }

  async deleteGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      }
    });
    if (!group) {
      throw new HttpException('Такой группы не существует ебать', HttpStatus.BAD_REQUEST);
    }
    await this.groupMembersRep.destroy({
      where: {
        groupId,
      }
    });
    await group.destroy();
    const author = await this.authorService.getAuthorById(group.authorId);
    await author.destroy();
  }

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
    const group = await this.groupRepository.findOne({
      where: {
        name,
      }
    });
    await this.authorService.updateAvatar(avatarName, group.author.id);
    return {message: 'Ну вроде нормал'};
  }
}
