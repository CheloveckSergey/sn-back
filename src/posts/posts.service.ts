import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { Op } from 'sequelize';
import { CreationsService } from 'src/creations/creations.service';
import { PostImagesService } from 'src/post-images/post-images.service';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { PostImage } from 'src/post-images/post-images.model';
import { Creation } from 'src/creations/creations.model';
import { Like } from 'src/likes/likes.model';
import { Comment } from 'src/comments/comments.model';
import { Author } from 'src/author/author.model';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private creationsService: CreationsService,
    private postImagesService: PostImagesService,
  ) {}

  // async createPostByUser(description: string, imageFile: Express.Multer.File, userId: number) {
  //   const author = await this.authorService.getAuthorByUserId(userId);
  //   const response = await this.createPost(description, imageFile, author.id);
  //   return response;
  // }

  // async createPostByGroup(description: string, imageFile: Express.Multer.File, groupName: string, userId: number) {
  //   console.log(groupName);
  //   const group = await this.groupService.getGroupByName(groupName);
  //   const response = await this.createPost(description, imageFile, group.author.id);
  //   return response;
  // }

  // async createPost(description: string, imageFile: Express.Multer.File, authorId: number) {
  //   if (!description && !imageFile) {
  //     return {message: 'Нельзя создать пост из нихуя'}
  //   }
  //   let imageName;
  //   if (imageFile) {
  //     imageName = uuid.v4() + '.jpg';
  //     await writeFile(path.resolve('src', 'static', imageName), imageFile.buffer);
  //   } else {
  //     imageName = null;
  //   }
  //   await this.postRepository.create(
  //     {description, image: imageName, authorId},
  //   );
  //   return {message: 'Пост успешно создан'}
  // }

  async getAllPostsByAuthors(authorIds: number[]) {
    const postCreations = await this.creationsService.getTCreationsByAuthorIds(CrTypeCodes.POST, authorIds);
    const posts = await this.postRepository.findAll({
      where: {
        creationId: {
          [Op.or]: postCreations.map(creation => creation.id),
        }
      },
      include: [
        {
          model: PostImage,
          as: 'postImages',
        },
        {
          model: Creation,
          as: 'creation',
          include: [
            Like,
            Comment,
            Author,
          ]
        }
      ],
    });
    return posts;
  }

  async getAllPostsByAuthorId(authorId: number) {
    console.log('GET_ALL_POSTS_BY_AUTHOR_ID');
    console.log('AUTHOR_ID: ' + authorId);
    const creations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.POST, authorId);
    if (!creations.length) {
      return [];
    }
    const posts = await this.postRepository.findAll({
      where: {
        creationId: {
          [Op.or]: creations.map(creation => creation.id),
        }
      },
      include: [
        {
          model: Creation,
          as: 'creation',
          include: [
            {
              model: Like,
              as: 'likes',
            },
            {
              model: Comment,
              as: 'comments',
              include: [
                {
                  model: Creation,
                  as: 'ownCreation',
                  include: [
                    {
                      model: Author,
                      as: 'author',
                    },
                    {
                      model: Like,
                      as: 'likes',
                    }
                  ]
                }
              ]
            },
            {
              model: Author,
              as: 'author',
            },
          ]
        },
        {
          model: PostImage,
          as: 'postImages',
          include: [
            {
              model: Creation,
              as: 'creation',
              include: [
                {
                  model: Like,
                  as: 'likes',
                },
                {
                  model: Comment,
                  as: 'comments',
                },
                {
                  model: Author,
                  as: 'author',
                },
              ]
            }
          ]
        },
        {
          model: Creation,
          as: 'creation',
          include: [
            Like,
            Comment,
          ]
        }
      ],
    });
    return posts;
  }

  async createPostByAuthor(description: string, imageFiles: Express.Multer.File[], authorId: number) {
    console.log("CREATE_POST_BY_AUTHOR");
    console.log("AUTHOR_ID: " + authorId + ' ' + typeof authorId);
    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.POST);
    const post = await this.postRepository.create({description, creationId: creation.id});
    for (let imageFile of imageFiles) {
      await this.postImagesService.createImage(imageFile, post.id, authorId);
    }
    return post;
  }

  async deletePostById(postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      }
    });
    await this.creationsService.deleteCreationById(post.creationId);
    await post.destroy();
    return {message: 'Пост успешно удалён. Это успех, я считаю'};
  }

  // async getAllPostsByUserId(userId: number) {
  //   const author = await this.authorService.getAuthorByUserId(userId);
  //   const posts = await this.getAllPostsByAuthorId(author.id);
  //   return posts;
  // }

  // async getAllPostsByGroupId(groupId: number) {
  //   const group = await this.groupService.getGroupById(groupId);
  //   const author = await this.authorService.getAuthorById(group.authorId);
  //   const posts = await this.getAllPostsByAuthorId(author.id);
  //   const _posts = posts.map(post => {
  //     return {
  //       author: {
  //         name: group.name,
  //         avatar: group.avatar,
  //         type: author.type,
  //       },
  //       creation: {
  //         comments: post.creation.comments,
  //         likes: post.creation.likes,
  //       },
  //       description: post.description,
  //       images: post.postImages,
  //     }
  //   })
  //   return _posts;
  // }

  // async getAllPostsByGroupName(groupName: string) {
  //   const group = await this.groupService.getGroupByName(groupName);
  //   const posts = await this.getAllPostsByAuthorId(group.author.id);
  //   return posts;
  // }

  // async getFeedByUserId(userId: number) {
  //   // const friends = await this.userService.getFriendsByUserId(userId);
  //   // const friendAuthors = friends.map(async (friend) => await this.authorService.getAuthorByUserId(friend.id));
  //   // const groups = await

  //   const authors = await this.userService.getAllSubAuthorsByUserId(userId);
  //   // console.log('AUTHORS');
  //   // authors.forEach(author => console.log(author.id));
  //   if (authors.length === 0) {
  //     return [];
  //   }
  //   const posts = await this.postRepository.findAll({
  //     where: {
  //       authorId: {
  //         [Op.or]: authors.map(author => author.id),
  //       }
  //     },
  //     include: {
  //       all: true,
  //     },
  //     order: sequelize.col('createdAt'),
  //   });
  //   // console.log('POSTS');
  //   // posts.forEach(post => console.log(post.id));
  //   return posts;
  // }
}
