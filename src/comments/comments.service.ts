import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment, OneComment } from './comments.model';
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

  async getCommentById(userId: number, commentId: number): Promise<OneComment> {
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
        },
        {
          model: Comment,
          as: 'responseToComment',
          include: [
            {
              model: Creation,
              as: 'ownCreation',
              include: [
                Author,
                Like,
              ],
            }
          ],
        }
      ]
    });
    const oneComment: OneComment = await this.getOneCommentByComment(userId, comment)
    return oneComment;
  }

  async getAllCommentsToCreationId(userId: number, creationId: number): Promise<OneComment[]> {
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
          ],
        },
        {
          model: Comment,
          as: 'responseToComment',
          include: [
            {
              model: Creation,
              as: 'ownCreation',
              include: [
                Author,
                Like,
              ],
            }
          ],
        }
      ]
    });
    const oneComments: OneComment[] = await Promise.all(comments.map(comment => this.getOneCommentByComment(userId, comment)));
    return oneComments;
  }

  async createComment(userId: number, authorId: number, text: string, creationId: number, responseToCommentId?: number) {
    const ownCreation = await this.creationsService.createCreation(authorId, CrTypeCodes.COMMENT);
    const _comment = await this.commentRepository.create({
      authorId,
      text,
      ownCreationId: ownCreation.id,
      creationId,
      responseToCommentId,
    })
    const comment = await this.getCommentById(userId, _comment.id); 
    return comment;
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.getCommentById(userId, commentId);
    // const ownCreation = await this.creationsService.getCreationById(comment.ownCreationId);
    // await ownCreation.destroy();
    await this.commentRepository.destroy({
      where: {
        id: commentId,
      }
    })
    return {message: 'Коммент успешно удалён'}
  }

  async getOneCommentByComment(userId: number, comment: Comment): Promise<OneComment> {
    const oneCommentCreation = await this.creationsService.getOneCommentCreationByCreation(userId, comment.ownCreation);
    const oneComment: OneComment = {
      id: comment.id,
      text: comment.text,
      ownCreationId: oneCommentCreation.id,
      ownCreation: oneCommentCreation,
      creationId: comment.creationId,
      creation: comment.creation,
      responseToCommentId: comment.responseToCommentId,
      responseToComment: comment.responseToComment,
    }
    return oneComment;
  }
}
