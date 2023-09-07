import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './images.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { UsersService } from 'src/users/users.service';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class ImagesService {

  constructor(
    @InjectModel(Image) private imageRepository: typeof Image,
    private usersService: UsersService,
    private groupService: GroupService,
  ) {}

  async createImageByAuthorId(authorId: number, file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Нет файла нахуй', HttpStatus.BAD_REQUEST);
    }

    const imageName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', imageName), file.buffer);
    
    const response = await this.imageRepository.create({value: imageName, authorId});
    return response;
  }

  async createImageByUserId(userId: number, file: Express.Multer.File) {
    const author = await this.usersService.getAuthorByUserId(userId);
    const response = await this.createImageByAuthorId(author.id, file);
    return response;
  }

  async createImageByGroupId(groupId: number, file: Express.Multer.File) {
    const author = await this.groupService.getAuthorByGroupId(groupId);  
    const response = await this.createImageByAuthorId(author.id, file);
    return response;
  }

  async getAllImagesByUserId(userId: number) {
    const author = await this.usersService.getAuthorByUserId(userId);  
    const images = await this.imageRepository.findAll({
      where: {
        authorId: author.id,
      },
      include: {
        all: true
      }
    });
    return images;
  }

  async getAllImagesByGroupId(groupId: number) {
    const author = await this.groupService.getAuthorByGroupId(groupId);  
    const images = await this.imageRepository.findAll({
      where: {
        authorId: author.id,
      },
      include: {
        all: true
      }
    });
    return images;
  }
}
