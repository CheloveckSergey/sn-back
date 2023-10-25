import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comments.model';
import { CreationsService } from 'src/creations/creations.service';
import { Author } from 'src/author/author.model';
import { Creation } from 'src/creations/creations.model';
import { Like } from 'src/likes/likes.model';
import { CrTypeCodes } from 'src/creations/creation-types.model';

@Injectable()
export class CommentsService {

  constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
    private creationsService: CreationsService,
  ) {}

  async getCommentById(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      include: [
        {
          model: Creation,
          as: 'ownCreation',
          include: [
            Author,
            Like,
          ]
        }
      ]
    });
    return comment;
  }

  async getAllCommentsToCreationId(creationId: number) {
    const comments = await this.commentRepository.findAll({
      where: {
        creationId,
      },
      include: [
        {
          model: Creation,
          as: 'ownCreation',
          include: [
            Author,
            Like,
          ]
        }
      ]
    });
    return comments;
  }

  async createComment(authorId: number, text: string, creationId: number) {
    const ownCreation = await this.creationsService.createCreation(authorId, CrTypeCodes.COMMENT);
    const comment = await this.commentRepository.create({
      authorId,
      text,
      ownCreationId: ownCreation.id,
      creationId,
    })
    return comment;
  }

  async deleteComment(commentId: number) {
    const comment = await this.getCommentById(commentId);
    // const ownCreation = await this.creationsService.getCreationById(comment.ownCreationId);
    // await ownCreation.destroy();
    await comment.destroy();
    return {message: 'Коммент успешно удалён'}
  }

  // async updateComment(userId: number, commentId: number, text: string) {
  //   const comment = await this.getCommentById(commentId);
  //   if (comment.userId !== userId) {
  //     throw new HttpException('А тебе нельзя так делать!', HttpStatus.BAD_REQUEST);
  //   }
  //   const newComment = await this.commentRepository.update({
  //     text
  //   }, {
  //     where: {
  //       id: commentId,
  //     }
  //   });
  //   return newComment;
  // }


  // async getCommentsByImageId(imageId: number) {
  //   const comments = await this.commentRepository.findAll({
  //     where: {
  //       imageId,
  //     },
  //     include: {
  //       all: true,
  //     }
  //   });
  //   return comments;
  // }

  // async getCommentsByPostId(postId: number) {
  //   const comments = await this.commentRepository.findAll({
  //     where: {
  //       postId,
  //     },
  //     include: {
  //       all: true,
  //     }
  //   });
  //   return comments;
  // }
}
