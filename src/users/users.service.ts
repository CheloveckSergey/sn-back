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
import { AuthorTypeCodes } from 'src/author/author-types.model';
import { Author, AuthorWithSubscribed } from 'src/author/author.model';

type OneUser = {
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
    @InjectModel(User_Friend) private user_FriendRep: typeof User_Friend,
    private rolesService: RolesService,
    private authorService: AuthorService,
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

  async getOneUserById(id: number, curUserId: number): Promise<OneUser> {
    const user = await this.userRepository.findOne({
      where: {id},
      include: [
        {
          model: Author,
          as: 'author',
        },
      ]
    });
    const isFriend = await this.isFriend(id, curUserId);
    const authorWithSubscribed: AuthorWithSubscribed = await this.authorService.getOneAuthorByAuthor(curUserId, user.author);
    const oneUser: OneUser = {
      id: user.id,
      login: user.login,
      avatar: user.avatar,
      isFriend,
      author: authorWithSubscribed,
    }
    return oneUser;
  }

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

  async createFriendship(userId1: number, userId2: number) {
    console.log('\n\nСОЗДАНИЕ ДРУЖБЫ ТАК СКАЗАЦ');
    const friends = await this.getFriendsByUserId(userId1);
    if (friends.find(friend => friend.id === userId2)) {
      throw new HttpException("Такие пользователи уже дружат, если ты понимаешь о чём я ;)", HttpStatus.BAD_REQUEST);
    }
    const user1 = await this.getUserById(userId1);
    const user2 = await this.getUserById(userId2);
    
    //Это полная хуйня, но я заебался с этими ебаными связями и методами, которые хуй пойми как сука ёбаная блять работают
    try {
      const possUser_Friend1 = await this.user_FriendRep.findOne({
        where: {
          userId1: user1.id,
          userId2: user2.id,
        }
      });
      if (!possUser_Friend1) {
        const user_friend1 = await this.user_FriendRep.create({userId1: user1.id, userId2: user2.id});
        await this.authorService.subscribe(user1.id, user2.authorId);
      }
      const possUser_Friend2 = await this.user_FriendRep.findOne({
        where: {
          userId2: user1.id,
          userId1: user2.id,
        }
      });
      if (!possUser_Friend2) {
        console.log('ВХОД');
        const user_friend2 = await this.user_FriendRep.create({userId1: user2.id, userId2: user1.id});
        await this.authorService.subscribe(user2.id, user1.authorId);
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

  async getFriendsByUserId(userId: number): Promise<OneUser[]> {
    const users_friends = await this.user_FriendRep.findAll({
      where: {
        userId1: userId,
      }
    });
    const allUsers = await this.getAllUsers();
    const _friends = allUsers.filter((user) => {
      for (let user_friend of users_friends) {
        if (user_friend.userId2 === user.id) {
          return true;
        }
      }
      return false;
    });
    const friends: OneUser[] = await Promise.all(_friends.map(async (_friend) => {
      const subscribed = await this.authorService.isSubscribed(userId, _friend.author.id);
      return {
        id: _friend.id,
        login: _friend.login,
        avatar: _friend.avatar,
        isFriend: true,
        author: {
          id: _friend.author.id,
          name: _friend.author.name,
          avatar: _friend.author.avatar,
          type: _friend.author.type,
          subscribed
        }
      }
    }));
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
    // friends.forEach(friend => console.log(friend.id));
    //Здесь приходится делать нестрогое сравнение из-за выше описанной хуеты
    const thisFriend = friends.find(friend => friend.id == userId2);
    if (!thisFriend) {
      throw new HttpException('А вы и не дружите. Лох.', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.user_FriendRep.destroy({
        where: {
          userId1,
          userId2,
        }
      });
      const user2 = await this.userRepository.findOne({
        where: {
          id: userId2,
        }
      });
      await this.authorService.unsubscribe(userId1, user2.authorId);
      await this.user_FriendRep.destroy({
        where: {
          userId1: userId2,
          userId2: userId1,
        }
      });
      const user1 = await this.userRepository.findOne({
        where: {
          id: userId1,
        }
      });
      await this.authorService.unsubscribe(userId2, user1.authorId);
    } catch(e) {
      console.log('КАКАЯ-ТО ХУЕТА В deleteFriend');
      console.log(e.message);
    }
    return { message: 'Ну теперь вы не дружите, кажется' };
  }

  async getPossibleFriends(userId: number) {
    const allUsers = await this.getAllUsers();
    const friends = await this.getFriendsByUserId(userId)
    const possibleFriends = allUsers.filter(user => {
      if (user.id == userId) return false;
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

  async isFriend(userId: number, curUserId: number): Promise<boolean> {
    const userFriend = await this.user_FriendRep.findOne({
      where: {
        userId1: userId,
        userId2: curUserId,
      }
    });
    return userFriend ? true : false;
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
