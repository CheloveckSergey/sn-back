import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostUser } from './posts.model';
import { CreatePostUserDto, PostResDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { writeFile } from 'fs/promises';
import * as uuid from 'uuid';
import * as path from 'path';
import { PULikeService } from 'src/likes/likes.service';

// interface Post {
//   id: number,
//   description: string | undefined | null,
//   image: string | undefined | null,
//   author: {
//     name: string,
//     avatar: string | undefined | null,
//   }
// }

@Injectable()
export class PostsUserService {

  constructor(
    @InjectModel(PostUser) private postRepository: typeof PostUser,
    private userService: UsersService,
    private puLikeService: PULikeService, 
  ) {}

  async createPost(description: string, imageFile: Express.Multer.File, userId: number) {
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
      {description, image: imageName, userId},
    );
    return {message: 'Пост успешно создан'}
  }

  async getAllPostByUserId(userId: number) {
    const posts = await this.postRepository.findAll({
      where: {
        userId,
      },
      include: {
        all: true,
      }
    });
    console.log(posts);
    const user = await this.userService.getUserById(userId);
    const newPosts: PostResDto[] = posts.map((post) => { 
      return {
        id: post.id, 
        description: post.description, 
        image: post.image, 
        createdAt: post.createdAt,
        author: {
          name: user.login, 
          avatar: user.avatar
        },
        likes: post.postUserLikes,
      }
    });
    return newPosts;
  }

}
