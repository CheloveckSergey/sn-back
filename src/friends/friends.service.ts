import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User_Friend } from './user-friends.model';
import { OneUser, UsersService } from 'src/users/users.service';
import { AuthorService } from 'src/author/author.service';
import { FriendRequestsService } from './friend-requests.service';
import { User } from 'src/users/users.model';
import { FriendRequest } from './friend-requests.model';

// interface UserWithFriend extends User, FriendStatusable {}

@Injectable()
export class FriendsService {

  constructor(
    @InjectModel(User_Friend) private user_FriendRep: typeof User_Friend,
    @InjectModel(FriendRequest) private friendRequestsRep: typeof FriendRequest,
    private usersService: UsersService,
    private authorService: AuthorService,
  ) {}

  async createFriendship(userId1: number, userId2: number) {
    console.log('\n\nСОЗДАНИЕ ДРУЖБЫ ТАК СКАЗАЦ');
    const friends = await this.getFriendsByUserId(userId1);
    if (friends.find(friend => friend.id === userId2)) {
      throw new HttpException("Такие пользователи уже дружат, если ты понимаешь о чём я ;)", HttpStatus.BAD_REQUEST);
    }
    const user1 = await this.usersService.getUserById(userId1);
    const user2 = await this.usersService.getUserById(userId2);
    
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
    const allUsers = await this.usersService.getAllUsers();
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
      const oneUser: OneUser = {
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
      return oneUser;
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
      const user2 = await this.usersService.getUserById(userId2);
      await this.authorService.unsubscribe(userId1, user2.authorId);
      await this.user_FriendRep.destroy({
        where: {
          userId1: userId2,
          userId2: userId1,
        }
      });
      const user1 = await this.usersService.getUserById(userId1);
      await this.authorService.unsubscribe(userId2, user1.authorId);
      await this.deleteAllBetweenUsers(userId1, userId2);
    } catch(e) {
      console.log('КАКАЯ-ТО ХУЕТА В deleteFriend');
      console.log(e.message);
    }
    return { message: 'Ну теперь вы не дружите, кажется' };
  }

  async getPossibleFriends(userId: number) {
    const allUsers = await this.usersService.getAllUsers();
    const friends = await this.getFriendsByUserId(userId);
    const results = await Promise.all(allUsers.map(async (user) => {
      if (user.id == userId) return false;
      const friend = friends.find(friend => friend.id === user.id);
      const request = await this.getRequestByUsers(userId, user.id);
      if (friend || request) {
        return false;
      }
      return true;
    }))
    const possibleFriends = allUsers.filter((user, index) => {
      return results[index]
    });
    return possibleFriends;
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

  async cancelDeleteFriend(userId1: number, userId2: number) {
    const request = await this.createRequest(userId1, userId2);
    await this.acceptRequest(request.id);
  }

  ///////////////////////////////////////////////////////////////////

  async getRequestById(id: number) {
    const request = await this.friendRequestsRep.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: 'user1',
        },
        {
          model: User,
          as: 'user2',
        }
      ]
    });
    return request;
  }

  async getAnyRequestBetweenUsers(userId1: number, userId2: number) {
    const request1 = await this.getRequestByUsers(userId1, userId2);
    if (request1) {
      return request1;
    }
    const request2 = await this.getRequestByUsers(userId2, userId1);
    if (request2) {
      return request2;
    }
    return undefined;
  }

  async getAllActiveOutcomeRequestsByUser(userId: number) {
    const requests = await this.friendRequestsRep.findAll({
      where: {
        userId1: userId,
        accepted: false,
        rejected: false,
      },
      include: [
        {
          model: User,
          as: 'user1',
        },
        {
          model: User,
          as: 'user2',
        }
      ],
    });
    return requests;
  }

  async getAllActiveIncomeRequestsByUser(userId: number) {
    const requests = await this.friendRequestsRep.findAll({
      where: {
        userId2: userId,
        accepted: false,
        rejected: false,
      },
      include: [
        {
          model: User,
          as: 'user1',
        },
        {
          model: User,
          as: 'user2',
        }
      ],
    });
    return requests;
  }

  async getRequestByUsers(userId1: number, userId2: number) {
    const request = await this.friendRequestsRep.findOne({
      where: {
        userId1,
        userId2,
      },
      include: [
        {
          model: User,
          as: 'user1',
        },
        {
          model: User,
          as: 'user2',
        }
      ]
    });
    return request;
  }

  async createRequest(userId1: number, userId2: number) {
    const alreadyFriends = await this.isFriend(userId1, userId2);
    if (alreadyFriends) {
      throw new HttpException('Пользователи уже дружат', HttpStatus.BAD_REQUEST);
    }

    const candidate = await this.getRequestByUsers(userId1, userId2);
    if (candidate) {
      throw new HttpException('Такая заявка от пользователя ' + candidate.user1.login + ' уже отправлялась', HttpStatus.BAD_REQUEST);
    }

    await this.friendRequestsRep.destroy({
      where: {
        userId1: userId2,
        userId2: userId1,
      }
    });

    const _request = await this.friendRequestsRep.create({userId1, userId2});
    const request = await this.getRequestById(_request.id);
    return request;
  }

  async rejectRequest(requestId: number) {
    const request = await this.getRequestById(requestId);
    if (request.rejected) {
      throw new HttpException('Заявка уже отклонена', HttpStatus.BAD_REQUEST)
    }
    if (request.accepted) {
      throw new HttpException('Заявка уже принята', HttpStatus.BAD_REQUEST)
    }
    await this.friendRequestsRep.update({
      rejected: true,
    }, {
      where: {
        id: request.id,
      }
    });
    return request;
  }

  async acceptRequest(requestId: number) {
    const request = await this.getRequestById(requestId)
    if (request.rejected) {
      throw new HttpException('Заявка уже отклонена', HttpStatus.BAD_REQUEST)
    }
    if (request.accepted) {
      throw new HttpException('Заявка уже принята', HttpStatus.BAD_REQUEST)
    } 
    await this.friendRequestsRep.update({
      accepted: true,
    }, {
      where: {
        id: request.id,
      }
    });
    await request.save();
    await this.createFriendship(request.userId1, request.userId2);
  }

  async deleteRequestById(id: number) {
    const request = await this.getRequestById(id);
    if (!request) {
      throw new HttpException('Такой заявки и так нет', HttpStatus.BAD_REQUEST);
    } 

    await request.destroy();
    return { message: 'Заявка удалена' }
  }

  async deleteAllBetweenUsers(userId1: number, userId2: number) {
    const request1 = await this.getRequestByUsers(userId1, userId2);
    if (request1) {
      await request1.destroy();
    }
    const request2 = await this.getRequestByUsers(userId2, userId1);
    if (request2) {
      await request2.destroy();
    }
  }
}
