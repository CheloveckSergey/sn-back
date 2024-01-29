import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OnePost, Post } from './posts.model';
import { Op } from 'sequelize';
import { CreationsService } from 'src/creations/creations.service';
import { PostImagesService } from 'src/post-images/post-images.service';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { OnePostImage, PostImage } from 'src/post-images/post-images.model';
import { Creation } from 'src/creations/creations.model';
import { Like } from 'src/likes/likes.model';
import { Comment } from 'src/comments/comments.model';
import { Author } from 'src/author/author.model';
import { AuthorType } from 'src/author/author-types.model';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private creationsService: CreationsService,
    private postImagesService: PostImagesService,
  ) {}

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
                      include: [
                        {
                          model: AuthorType,
                          as: 'type',
                        }
                      ]
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

  async getOnePostByPost(userId: number, post: Post): Promise<OnePost> {
    const oneCreation = await this.creationsService.getOneCreationByCreation(userId, post.creation);
    const onePostImages: OnePostImage[] = await Promise.all(post.postImages.map(postImage => {
      return this.postImagesService.getOnePostImage(userId, postImage);
    }));
    const onePost: OnePost = {
      id: post.id,
      description: post.description,
      creationId: post.creationId,
      creation: oneCreation,
      postImages: onePostImages,
    }
    return onePost;
  }

  async getAllOnePostsByAuthorId(userId: number, authorId: number): Promise<OnePost[]> {
    const allPosts = await this.getAllPostsByAuthorId(authorId);
    const allOnePosts = await Promise.all(allPosts.map(post => this.getOnePostByPost(userId, post)));
    return allOnePosts;
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

  /////////////////////////////////////////////////////////////////////////

  async getFeedByAuthorId(userId: number, authorId: number) {
    const posts = await this.getAllOnePostsByAuthorId(userId, authorId);
    return posts;
  }
}
