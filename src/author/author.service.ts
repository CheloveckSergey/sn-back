import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from './author.model';
import { User } from 'src/users/users.model';

export type _Author = {
  id: number,
  name: string,
  avatar: string | undefined,
  authorType: string,
  subscribedFor: boolean,
}

export type _Sub = {
  id: number,
  login: string,
  avatar: string | undefined,
}

@Injectable()
export class AuthorService {

  constructor(
    @InjectModel(Author) private authorRep: typeof Author,
  ) {}

  async createAuthor(dto: CreateAuthorReq) {
    let response: Author;
    if (dto.authorType === 'group') {
      response = await this.authorRep.create({name: dto.name, avatar: dto.avatar, authorType: dto.authorType, groupId: dto.authorId});
    } else if (dto.authorType === 'user') {
      response = await this.authorRep.create({name: dto.name, avatar: dto.avatar, authorType: dto.authorType, userId: dto.authorId});
    } else {
      throw new HttpException('Странный тип автора...', HttpStatus.BAD_REQUEST);
    }
    return response
  }

  async getAuthorById(id: number) {
    const author = await this.authorRep.findOne({
      where: {
        id
      },
      include: {
        all: true,
      }
    });
    return author;
  }

  async getAuthorByName(name: string) {
    const author = await this.authorRep.findOne({
      where: {
        name
      },
      include: {
        all: true,
      }
    });
    return author;
  }

  async getAuthorByUserId(id: number, curUserId?: number) {
    const author = await this.authorRep.findOne({
      where: {
        userId: id,
      }
    });
    return author;
  }

  async getAuthorByGroupId(id: number, curUserId?: number): Promise<_Author> {
    const author = await this.authorRep.findOne({
      where: {
        groupId: id,
      }
    });
    const subscribers = await this.getSubscribersByAuthorId(author.id);
    // console.log(subscribers);
    console.log(curUserId);
    let _author: _Author = {
      id: author.id,
      name: author.name,
      avatar: author.avatar,
      authorType: author.authorType,
      subscribedFor: false,
    };
    if (subscribers.find(sub => sub.id === curUserId)) {
      _author.subscribedFor = true;
    }
    return _author;
  }

  async deleteAuthorById(id: number) {
    const response = await this.authorRep.destroy({
      where: {
        id
      }
    });
    return response;
  }

  async deleteAuthorByName(name: string) {
    const response = await this.authorRep.destroy({
      where: {
        name
      }
    });
    return response;
  }

  async getSubscribersByAuthorId(authorId: number) {
    const author = await this.authorRep.findOne({
      where: {
        id: authorId,
      },
      include: [{model: User}],
    });
    const subscribers = author.subscribers.map(sub => {
      let _sub: any = {};
      Object.keys(sub.dataValues).forEach(key => {
        _sub[key] = sub[key];
      });
      return _sub;
    });
    // console.log(subscribers);
    return subscribers;
  }

  async subscribe(userId: number, authorId: number) {
    const subscribers = await this.getSubscribersByAuthorId(authorId);
    const candidate = subscribers.find(subscriber => subscriber.id === userId);
    if (candidate) {
      throw new HttpException('Подписка уже оформлена', HttpStatus.BAD_REQUEST);
    }
    const author = await this.getAuthorById(authorId);
    // author.$set('subscribers', [userId]);
    author.$add('subscribers', [userId]);
    return {message: 'Ну вроде подписался'};
  }

  //Тут та же хрень со стринговым userId, я хз с чем это связано
  async unsubscribe(userId: number, authorId: number) {
    const subscribers = await this.getSubscribersByAuthorId(authorId);
    console.log('SUBSCRIBERS');
    console.log(subscribers);
    const candidate = subscribers.find(subscriber => {
      console.log(subscriber.id + ':' + userId);
      console.log(typeof userId);
      return subscriber.id == userId
    });
    console.log('CANDIDATE');
    console.log(candidate);
    if (!candidate) {
      throw new HttpException('Юзер с id ' + userId + ' не подписан на автора с id ' + authorId, HttpStatus.BAD_REQUEST);
    }
    const author = await this.getAuthorById(authorId);
    author.$remove('subscribers', [userId]);
    return {message: 'Ну вроде отписался'};
  }

  // async getAllSubGrAuthor(userId) {
  //   const authors = await this.authorRep.findAll({
  //     where: {
  //       subscribers: use
  //     }
  //   })
  // }

  async updateAvatar(fileName: string, authorId: number) {
    const response = await this.authorRep.update(
      {
        avatar: fileName,
      }, {
        where: {
          id: authorId,
        }
      }
    );
    return response;
  }
}
