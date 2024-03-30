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
import { AuthorService } from 'src/author/author.service';
import { UsersService } from 'src/users/users.service';
import { Music, OneMusic } from 'src/musics/musics.model';
import { MusicsService } from 'src/musics/musics.service';
import { Musician } from 'src/musicians/musicians.model';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private creationsService: CreationsService,
    private postImagesService: PostImagesService,
    private usersService: UsersService,
    private musicsService: MusicsService,
  ) {}

  async getPostById(id: number, userId: number): Promise<OnePost> {
    const post = await this.postRepository.findOne({
      where: {
        id,
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
        },
        {
          model: Music,
          as: 'musics',
          include: [
            {
              model: Musician,
              as: 'musician',
            }
          ]
        },
      ]
    });
    const onePost: OnePost = await this.getOnePostByPost(userId, post);
    return onePost;
  }

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
        },
        {
          model: Music,
          as: 'musics',
          include: [
            {
              model: Musician,
              as: 'musician',
            }
          ]
        },
      ],
    });
    return posts;
  }

  async getOnePostByPost(userId: number, post: Post): Promise<OnePost> {
    const user = await this.usersService.getUserById(userId);

    if (post.type === 'ownPost') {

      const oneCreation = await this.creationsService.getOneCreationByCreation(userId, post.creation);
      const onePostImages: OnePostImage[] = await Promise.all(post.postImages.map(postImage => {
        return this.postImagesService.getOnePostImage(userId, postImage);
      }));
      const oneMusics: OneMusic[] = await Promise.all(post.musics.map(music => {
        return this.musicsService.getOneMusicByMusic(music, user.authorId);
      }));

      const reposts = await this.postRepository.findAll({
        where: {
          type: 'repost',
          repostId: post.id,
        }
      });
      const repostsNumber: number = reposts.length;

      let isReposted: boolean;
      const pCreations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.POST, user.authorId)
      if (!pCreations.length) {
        isReposted = false;
      } else {
        const _post = await this.postRepository.findOne({
          where: {
            type: 'repost',
            repostId: post.id,
            creationId: {
              [Op.or]: pCreations.map(creation => creation.id),
            }
          }
        });
        if (_post) {
          isReposted = true;
        } else {
          isReposted = false;
        }
      }

      const onePost: OnePost = {
        id: post.id,
        description: post.description,
        creationId: post.creationId,
        creation: oneCreation,
        postImages: onePostImages,
        musics: oneMusics,
        type: post.type,
        repost: null,
        repostId: null,
        repostsNumber,
        isReposted,
      }

      return onePost;
    } else {
      const oneCreation = await this.creationsService.getOneCreationByCreation(userId, post.creation);
      const onePostImages: OnePostImage[] = await Promise.all(post.postImages.map(postImage => {
        return this.postImagesService.getOnePostImage(userId, postImage);
      }));
      const oneMusics: OneMusic[] = await Promise.all(post.musics.map(music => {
        return this.musicsService.getOneMusicByMusic(music, user.authorId);
      })) 

      const oneRepostCreation = await this.creationsService.getOneCreationByCreation(userId, post.repost.creation);
      const oneRepostImages: OnePostImage[] = await Promise.all(post.repost.postImages.map(postImage => {
        return this.postImagesService.getOnePostImage(userId, postImage);
      }));

      const reposts = await this.postRepository.findAll({
        where: {
          type: 'repost',
          repostId: post.repost.id,
        }
      });
      const repostsNumber: number = reposts.length;

      let isReposted: boolean;
      const pCreations = await this.creationsService.getTCreationsByAuthorId(CrTypeCodes.POST, user.authorId)
      if (!pCreations.length) {
        isReposted = false;
      } else {
        const _post = await this.postRepository.findOne({
          where: {
            type: 'repost',
            repostId: post.repost.id,
            creationId: {
              [Op.or]: pCreations.map(creation => creation.id),
            }
          }
        });
        if (_post) {
          isReposted = true;
        } else {
          isReposted = false;
        }
      }

      const onePost: OnePost = {
        id: post.id,
        description: post.description,
        creationId: post.creationId,
        creation: oneCreation,
        postImages: onePostImages,
        musics: [],
        type: post.type,
        repostId: post.repostId,
        repostsNumber: 0,
        isReposted: false,
        repost: {
          id: post.repost.id,
          description: post.repost.description,
          creationId: post.repost.creationId,
          creation: oneRepostCreation,
          postImages: oneRepostImages,
          musics: oneMusics,
          repostsNumber,
          isReposted,
          type: 'ownPost',
        },
      }

      return onePost;
    }
  }

  async getAllOnePostsByAuthorId(userId: number, authorId: number): Promise<OnePost[]> {
    const allPosts = await this.getAllPostsByAuthorId(authorId);
    const allOnePosts = await Promise.all(allPosts.map(post => this.getOnePostByPost(userId, post)));
    return allOnePosts;
  }

  async createPostByAuthor(description: string, imageFiles: Express.Multer.File[], authorId: number, musicsIds: number[] | null, userId: number) {
    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.POST);
    const post = await this.postRepository.create({description, creationId: creation.id});
    for (let imageFile of imageFiles) {
      await this.postImagesService.createImage(imageFile, post.id, authorId);
    }
    if (musicsIds) {
      const musics = await Promise.all(musicsIds.map(musicId => this.musicsService.getById(musicId)));
      for (let music of musics) {
        post.$add('musics', music.id);
      }
    }
    const onePost: OnePost = await this.getPostById(post.id, userId)
    return onePost;
  }

  async createRepost(repostId: number, authorId: number) {
    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.POST);
    const post = await this.postRepository.create({creationId: creation.id, type: 'repost', repostId});
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

  async getFeedByAuthorId(authorId: number, userId: number, query: { offset?: number, limit?: number }) {
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
      order: [
        ['createdAt', 'DESC']
      ],
      offset: Number(query.offset),
      limit: Number(query.limit),
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
        },
        {
          model: Music,
          as: 'musics',
          include: [
            {
              model: Musician,
              as: 'musician',
            }
          ]
        },
        {
          model: Post,
          as: 'repost',
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
              model: Music,
              as: 'musics',
              include: [
                {
                  model: Musician,
                  as: 'musician',
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
          ]
        }
      ],
    });
    const onePosts = await Promise.all(posts.map(post => this.getOnePostByPost(userId, post)));
    return onePosts;
  }
}
