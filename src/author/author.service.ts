import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author, OneAuthor } from './author.model';
import { User } from 'src/users/users.model';
import { AuthorType, AuthorTypeCodes, AuthorTypeNames } from './author-types.model';
import { Op } from 'sequelize';
import { Author_Subs } from './author-subs.model';

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
    @InjectModel(AuthorType) private authorTypeRep: typeof AuthorType,
    @InjectModel(Author_Subs) private authorSubsRep: typeof Author_Subs,
  ) {}

  async getAuthorById(id: number) {
    const author = await this.authorRep.findOne({
      where: {
        id
      },
    });
    return author;
  }

  async getOneAuthorByAuthor(userId: number, _author: Author): Promise<OneAuthor> {
    const author = await this.authorRep.findOne({
      where: {
        id: _author.id,
      }, 
      include: [
        {
          model: AuthorType,
          as: 'type',
        },
        {
          model: User,
          as: 'subscribers',
        },
      ]
    })
    const isSubscribed = await this.isSubscribed(userId, author.id);
    const oneAuthor: OneAuthor = {
      id: author.id,
      name: author.name,
      avatar: author.avatar,
      type: author.type,
      subscribed: isSubscribed,
      subsNumber: author.subscribers.length,
    }
    return oneAuthor;
  }

  async createAuthor(name: string, typeCode: AuthorTypeCodes, avatar?: string | undefined) {
    const authorType = await this.authorTypeRep.findOne({
      where: {
        code: typeCode,
      }
    });
    const author = await this.authorRep.create({
      typeId: authorType.id,
      name,
      avatar,
    });
    return author;
  }

  async deleteAuthorById(id: number) {
    const response = await this.authorRep.destroy({
      where: {
        id
      }
    });
    return response;
  }

  async getSubscribersByAuthorId(authorId: number) {
    const author = await this.authorRep.findOne({
      where: {
        id: authorId,
      },
      include: {
        model: User,
        as: 'subscribers',
      },
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

  async isSubscribed(userId: number, authorId: number): Promise<boolean> {
    const authorSub = await this.authorSubsRep.findOne({
      where: {
        userId,
        authorId,
      }
    });
    if (authorSub) {
      return true;
    } else {
      return false;
    }
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

  // //Тут та же хрень со стринговым userId, я хз с чем это связано
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

  async createAuthorType(authorTypeCode: AuthorTypeCodes, authorTypeName: AuthorTypeNames) {
    if (!Object.values(AuthorTypeCodes).includes(authorTypeCode)) {
      throw new HttpException('Такого кода типа автора не существует', HttpStatus.BAD_REQUEST);
    }
    if (!Object.values(AuthorTypeNames).includes(authorTypeName)) {
      throw new HttpException('Такого названия типа автора не существует', HttpStatus.BAD_REQUEST);
    }

    const authorType = await this.authorTypeRep.create({code: authorTypeCode, name: authorTypeName});
    return authorType;
  }
}
