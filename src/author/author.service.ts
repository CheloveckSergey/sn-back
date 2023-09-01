import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from './author.model';
import { where } from 'sequelize';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { GroupService } from 'src/group/group.service';

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

  async getAuthorByUserId(id: number) {
    const author = await this.authorRep.findOne({
      where: {
        userId: id,
      }
    });
    return author;
  }

  async getAuthorByGroupId(id: number) {
    const author = await this.authorRep.findOne({
      where: {
        groupId: id,
      }
    });
    return author;
  }

  async getAuthorByNameWithAll(name: string) {
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

  async getAllPostsByUserId(id: number) {
    const author = await this.authorRep.findOne({
      where: {
        userId: id
      },
      include: {
        all: true,
      }
    });
    return author.posts[0];
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
}
