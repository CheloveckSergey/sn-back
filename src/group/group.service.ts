import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group, GroupWithSubscribed } from './group.model';
import { UsersService } from 'src/users/users.service';
import { GroupDesc } from './group-desc.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { AuthorService, _Author } from 'src/author/author.service';
import { AuthorType, AuthorTypeCodes } from 'src/author/author-types.model';
import { GMTypes, GroupMember } from './group-members.model';
import { Author } from 'src/author/author.model';
import { User } from 'src/users/users.model';

//Возвращает автора, с информацией, подписан ли на него текущий пользователь,
//и массивом подписчиков, в котором есть текущий юзер, либо нет
// interface AuthorWithSubscribed extends Author {
//   subscribed: boolean;
// }

// interface GroupWithSubscribed extends Group {
//   author: AuthorWithSubscribed;
// }

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

  // Это какой то пиздец, но, если данный юзер не подписан на автора,
  // то автор просто не хочет подгружаться. Из-за этого приходится
  // отдельно искать подписчика в авторе, делая дополнительный запрос.
  async getGroupById(id: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id
      },
      include: [
        {
          model: Author,
          as: 'author',
          include: [
            {
              model: AuthorType,
              as: 'type',
            },
            // {
            //   model: User,
            //   as: 'subscribers',
            //   // where: {
            //   //   id: userId,
            //   // }
            // }
          ]
        }
      ]
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

  async getGroupWSFromGroup(group: Group, userId: number) {
    const isSubscribed = await this.authorService.isSubscribed(userId, group.author.id);
    const groupWithSubscribed: GroupWithSubscribed = {
      id: group.id,
      name: group.name,
      avatar: group.avatar,
      author: {
        id: group.author.id,
        name: group.author.name,
        avatar: group.author.avatar,
        type: group.author.type,
        subscribed: isSubscribed ? true : false,
      }
    }
    return groupWithSubscribed;
  }

  async getGroupWS(groupId: number, userId: number) {
    const group = await this.getGroupById(groupId);
    const groupWithSubscribed = this.getGroupWSFromGroup(group, userId)
    return groupWithSubscribed;
  }

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

  async deleteGroup(groupId: number) {
    const group = await this.getGroupById(groupId);
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
    const group = await this.getGroupByName(name);
    await this.authorService.updateAvatar(avatarName, group.author.id);
    return {message: 'Ну вроде нормал'};
  }
}
