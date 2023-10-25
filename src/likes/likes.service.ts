import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './likes.model';
import { User } from 'src/users/users.model';

@Injectable()
export class LikesService {

  constructor(
    @InjectModel(Like) private likeRep: typeof Like,
  ) {}

  private async getLike(userId: number, creationId: number) {
    const like = await this.likeRep.findOne({
      where: {
        userId,
        creationId,
      }
    });
    return like;
  }

  async getLikesByCreationId(creationId: number) {
    const likes = await this.likeRep.findAll({
      where: {
        creationId,
      },
      include: [
        User,
      ]
    });
    return likes;
  }

  async getLikesByUserId(userId: number) {
    const likes = await this.likeRep.findAll({
      where: {
        userId,
      }
    });
    return likes;
  }

  async createLike(userId: number, creationId: number) {
    const candidate = await this.getLike(userId, creationId);
    if (candidate) {
      throw new HttpException('Такой лайк уже существует', HttpStatus.BAD_REQUEST);
    }
    const like = await this.likeRep.create({userId: userId, creationId: creationId});
    return like;
  }

  async deleteLike(userId: number, creationId: number) {
    const candidate = await this.getLike(userId, creationId);
    if (!candidate) {
      throw new HttpException('Такого лайка не существует', HttpStatus.BAD_REQUEST);
    }
    candidate.destroy();
    return {message: 'Ну вроде удалено, так сказац'};
  }
}
