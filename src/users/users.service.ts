import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import * as uuid from 'uuid';
import { writeFile } from "fs/promises";
import * as path from "path";
import { AuthorService } from 'src/author/author.service';
import { User_Friend } from './user-friends.model';

type OneUser = {
  id: number,
  login: string,
  avatar: string,
  isFriend: boolean,
}

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(User_Friend) private user_FriendRep: typeof User_Friend,
    private rolesService: RolesService,
    private authorService: AuthorService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue(3);
    user.$set('roles', [role.id]);
    const author = this.authorService.createAuthor({name: user.login, authorType: 'user', authorId: user.id});
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({include: {all: true}});
    return users;
  }

  async getUserById(id: number, curUserId?: number) {
    const user = await this.userRepository.findOne({
      where: {id},
    });
    let _user: OneUser;
    if (!curUserId) {
      _user = {
        id: user.id,
        login: user.login,
        avatar: user.avatar,
        isFriend: false,
      };
      return _user;
    }
    const user_friend = await this.user_FriendRep.findOne({
      where: {
        userId1: id,
        userId2: curUserId,
      }
    })
    if (user_friend) {
      _user = {
        id: user.id,
        login: user.login,
        avatar: user.avatar,
        isFriend: true,
      }
    } else {
      _user = {
        id: user.id,
        login: user.login,
        avatar: user.avatar,
        isFriend: false,
      }
    }
    return _user;
  }

  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({where: {login}});
    return user;
  }

  async getAvatarById(id: number) {
    const avatar = await this.userRepository.findOne({
      where: {id},
      attributes: ['avatar'],
    });
    return avatar;
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
    const author = await this.authorService.getAuthorByUserId(id);
    await this.authorService.updateAvatar(avatarName, author.id);
    return {message: 'Ну вроде нормал'};
  }

  async createFriendship(userId1: number, userId2: number) {
    console.log(userId1 + ':' + userId2);
    const friends = await this.getFriendsByUserId(userId1);
    if (friends.find(friend => friend.id === userId2)) {
      throw new HttpException("Такие пользователи уже дружат, если ты понимаешь о чём я ;)", HttpStatus.BAD_REQUEST);
    }
    const user1 = await this.getUserById(userId1);
    const user2 = await this.getUserById(userId2);
    
    // //Это полная хуйня, но я заебался с этими ебаными связями и методами, которые хуй пойми как сука ёбаная блять работают
    try {
      const possUser_Friend1 = await this.user_FriendRep.findOne({
        where: {
          userId1: user1.id,
          userId2: user2.id,
        }
      });
      if (!possUser_Friend1) {
        const user_friend1 = await this.user_FriendRep.create({userId1: user1.id, userId2: user2.id})
      }
      const possUser_Friend2 = await this.user_FriendRep.findOne({
        where: {
          userId1: user2.id,
          userId2: user1.id,
        }
      });
      if (!possUser_Friend2) {
        const user_friend2 = await this.user_FriendRep.create({userId1: user2.id, userId2: user1.id})
      }
    } catch (error) {
      console.log(error);
    }

    // await user1.$add('friends', user1, {
    //   through: {userId1: user1.id, userId2: userId2}
    // });
    console.log('lal');
    return {message: 'Ну вроде подружился'};
  }

  async getFriendsByUserId(userId: number) {
    const users_friends = await this.user_FriendRep.findAll({
      where: {
        userId1: userId,
      }
    });
    const allUsers = await this.getAllUsers();
    const friends = allUsers.filter((user) => {
      for (let user_friend of users_friends) {
        if (user_friend.userId2 === user.id) {
          return true;
        }
      }
      return false;
    });
    return friends;
    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: userId,
    //   },
    //   include: [{model: User}],
    // });
    // const friends = user.friends;
    // return friends;
  }

  //Я хуй знает почему, но в этом методе "userId2" почему то стринговый, 
  //хотя в объявлении точно указано number, просто чудеса ебать :)
  async deleteFriend(userId1: number, userId2: number) {
    const friends = await this.getFriendsByUserId(userId1);
    //Здесь приходится делать нестрогое сравнение из-за выше описанной хуеты
    const thisFriend = friends.find(friend => friend.id == userId2);
    if (!thisFriend) {
      throw new HttpException('А вы и не дружите. Лох.', HttpStatus.BAD_REQUEST);
    }
    await this.user_FriendRep.destroy({
      where: {
        userId1,
        userId2,
      }
    });
    await this.user_FriendRep.destroy({
      where: {
        userId1: userId2,
        userId2: userId1,
      }
    });
    return { message: 'Ну теперь вы не дружите, кажется' };
  }

  async getPossibleFriends(userId: number) {
    const allUsers = await this.getAllUsers();
    const friends = await this.getFriendsByUserId(userId)
    const possibleFriends = allUsers.filter(user => {
      if (user.id === userId) return false;
      for (let friend of friends) {
        if (friend.id === user.id) {
          return false;
        }
      }
      return true;
    });
    return possibleFriends;
    // return allUsers;
  }
}
