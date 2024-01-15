import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import * as uuid from 'uuid';
import { writeFile } from "fs/promises";
import * as path from "path";
import { AuthorService } from 'src/author/author.service';
import { AuthorTypeCodes } from 'src/author/author-types.model';
import { Author, AuthorWithSubscribed } from 'src/author/author.model';

export interface OneUser {
  id: number,
  login: string,
  avatar: string,
  isFriend: boolean,
  author: AuthorWithSubscribed,
}

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
    private authorService: AuthorService,
    // private friendsService: FriendsService,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      include: [
        {
          model: Author,
          as: 'author',
        }
      ]
    });
    return users;
  }
  
  async getUserById(id: number, curUserId?: number) {
    const user = await this.userRepository.findOne({
      where: {id},
      include: [
        {
          model: Author,
          as: 'author',
        },
      ]
    });
    return user;
  }

  // async getOneUserById(id: number, curUserId: number): Promise<OneUser> {
  //   const user = await this.userRepository.findOne({
  //     where: {id},
  //     include: [
  //       {
  //         model: Author,
  //         as: 'author',
  //       },
  //     ]
  //   });
  //   const isFriend = await this.friendsService.isFriend(id, curUserId);
  //   const authorWithSubscribed: AuthorWithSubscribed = await this.authorService.getOneAuthorByAuthor(curUserId, user.author);
  //   const oneUser: OneUser = {
  //     id: user.id,
  //     login: user.login,
  //     avatar: user.avatar,
  //     isFriend,
  //     author: authorWithSubscribed,
  //   }
  //   return oneUser;
  // }

  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({
      where: {
        login,
      },
      include: {
        all: true,
      }
    });
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const author = await this.authorService.createAuthor(dto.login, AuthorTypeCodes.USER);
    const user = await this.userRepository.create({login: dto.login, password: dto.password, authorId: author.id});
    const role = await this.rolesService.getRoleByValue(3);
    user.$set('roles', [role.id]);
    return user;
  }

  async createAvatar(id: number, file: Express.Multer.File) {
    const avatarName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', avatarName), file.buffer);
    await this.userRepository.update(
      {avatar: avatarName},
      {
        where: {
          id
        }
      }
    );
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    })
    await this.authorService.updateAvatar(avatarName, user.authorId);
    return {message: 'Ну вроде нормал'};
  }

  

  async getAllSubAuthorsByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      include: {
        all: true,
      }
    });
    console.log(user.subAuthors);
    return user.subAuthors;
  }
}
