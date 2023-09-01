import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { writeFile } from 'fs/promises';
import * as uuid from 'uuid';
import * as path from 'path';
import { AuthorService } from 'src/author/author.service';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class PostsUserService {

  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private authorService: AuthorService,
    private groupService: GroupService,
  ) {}

  async createPostByUser(description: string, imageFile: Express.Multer.File, userId: number) {
    const author = await this.authorService.getAuthorByUserId(userId);
    const response = await this.createPost(description, imageFile, author.id);
    return response;
  }

  async createPostByGroup(description: string, imageFile: Express.Multer.File, groupName: string, userId: number) {
    console.log(groupName);
    const group = await this.groupService.getGroupByName(groupName);
    const response = await this.createPost(description, imageFile, group.author.id);
    return response;
  }

  async createPost(description: string, imageFile: Express.Multer.File, authorId: number) {
    if (!description && !imageFile) {
      return {message: 'Нельзя создать пост из нихуя'}
    }
    let imageName;
    if (imageFile) {
      imageName = uuid.v4() + '.jpg';
      await writeFile(path.resolve('src', 'static', imageName), imageFile.buffer);
    } else {
      imageName = null;
    }
    await this.postRepository.create(
      {description, image: imageName, authorId},
    );
    return {message: 'Пост успешно создан'}
  }

  async getAllPostByAuthorId(authorId: number) {
    const posts = await this.postRepository.findAll({
      where: {
        authorId,
      },
      include: {
        all: true,
      }
    });
    return posts;
  }

  async getAllPostByUserId(userId: number) {
    const author = await this.authorService.getAuthorByUserId(userId);
    const posts = await this.getAllPostByAuthorId(author.id);
    return posts;
  }

  async getAllPostByGroupId(groupId: number) {
    const author = await this.authorService.getAuthorByGroupId(groupId);
    const posts = await this.getAllPostByAuthorId(author.id);
    return posts;
  }

  async getAllPostsByGroupName(groupName: string) {
    const group = await this.groupService.getGroupByName(groupName);
    const posts = await this.getAllPostByAuthorId(group.author.id);
    return posts;
  }
}
