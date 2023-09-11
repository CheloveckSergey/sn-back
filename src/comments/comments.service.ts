import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comments.model';

type typeComment = 'image' | 'post';

@Injectable()
export class CommentsService {

  constructor(@InjectModel(Comment) private commentRepository: typeof Comment) {}

  async createComment(userId: number, text: string, typeComment: typeComment, creationId: number) {
    if (!text) {
      throw new HttpException('Нет текста для коммента ебать', HttpStatus.BAD_REQUEST);
    }
    if (!typeComment) {
      throw new HttpException('Не понимаю, для чего коммент', HttpStatus.BAD_REQUEST);
    }
    if (!creationId) {
      throw new HttpException('Нет айдишника того, для чего нужен коммент нахуй', HttpStatus.BAD_REQUEST);
    }
    console.log(typeComment);
    let response: Comment;
    if (typeComment === 'image') {
      console.log('imageCreation');
      response = await this.commentRepository.create({userId, text, imageId: creationId});
    } else if (typeComment === 'post') {
      console.log('postCreation');
      response = await this.commentRepository.create({userId, text, postId: creationId});
    }
    return response;
  }

  async updateComment(userId: number, commentId: number, text: string) {
    const comment = await this.getCommentById(commentId);
    if (comment.userId !== userId) {
      throw new HttpException('А тебе нельзя так делать!', HttpStatus.BAD_REQUEST);
    }
    const newComment = await this.commentRepository.update({
      text
    }, {
      where: {
        id: commentId,
      }
    });
    return newComment;
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.getCommentById(commentId);
    if (comment.userId !== userId) {
      throw new HttpException('А тебе нельзя так делать!', HttpStatus.BAD_REQUEST);
    } 
    const deletedComment = await this.commentRepository.destroy({
      where: {
        id: commentId,
      }
    });
    return {message: 'Коммент успешно удалён'}
  }

  async getCommentById(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      }
    });
    return comment;
  }

  async getCommentsByImageId(imageId: number) {
    const comments = await this.commentRepository.findAll({
      where: {
        imageId,
      },
      include: {
        all: true,
      }
    });
    return comments;
  }

  async getCommentsByPostId(postId: number) {
    const comments = await this.commentRepository.findAll({
      where: {
        postId,
      },
      include: {
        all: true,
      }
    });
    return comments;
  }
}
