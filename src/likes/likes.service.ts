import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostUserLike } from './likes.model';
import { PULikeReqDto } from './dto';

@Injectable()
export class PULikeService {

  constructor(
    @InjectModel(PostUserLike) private puLikeReposiroty: typeof PostUserLike,
  ) {}

  private async getAllPULikes() {
    const allPULikes = await this.puLikeReposiroty.findAll();
    return allPULikes;
  }

  async getAllPULikesByPostId(postUserId: number) {
    const puLikes = await this.puLikeReposiroty.findAll({
      where: {
        postUserId,
      }
    });
    return puLikes;
  }

  async getAllPULikesByUserId(userId: number) {
    const puLikes = await this.puLikeReposiroty.findAll({
      where: {
        userId,
      }
    });
    return puLikes;
  }

  async createPULike(dto: PULikeReqDto) {
    const allPULikes = await this.getAllPULikes();
    if (allPULikes.find(puLike => puLike.userId === dto.userId && puLike.postUserId === dto.postUserId)) {
      throw new HttpException('Такой лайк уже существует', HttpStatus.BAD_REQUEST);
    }
    const puLike = await this.puLikeReposiroty.create(dto);
    return puLike
  }

  async deletePULike(dto: PULikeReqDto) {
    const allPULikes = await this.getAllPULikes();
    if (!allPULikes.find(puLike => puLike.userId === dto.userId && puLike.postUserId === dto.postUserId)) {
      throw new HttpException('Такого лайка не существует', HttpStatus.BAD_REQUEST);
    }
    const puLike = await this.puLikeReposiroty.destroy({
      where: {
        userId: dto.userId,
        postUserId: dto.postUserId,
      }
    });
    return puLike;
  }
}
