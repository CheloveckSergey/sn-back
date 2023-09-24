import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostLike } from './likes.model';
import { PULikeReqDto } from './dto';

@Injectable()
export class PULikeService {

  constructor(
    @InjectModel(PostLike) private puLikeReposiroty: typeof PostLike,
  ) {}
  
  async createPULike(dto: PULikeReqDto) {
    const allPULikes = await this.getAllPULikes();
    if (allPULikes.find(puLike => puLike.userId === dto.userId && puLike.postId === dto.postUserId)) {
      throw new HttpException('Такой лайк уже существует', HttpStatus.BAD_REQUEST);
    }
    const puLike = await this.puLikeReposiroty.create({postId: dto.postUserId, userId: dto.userId});
    return puLike
  }

  private async getAllPULikes() {
    const allPULikes = await this.puLikeReposiroty.findAll();
    return allPULikes;
  }

  async getAllPULikesByPostId(postId: number) {
    const puLikes = await this.puLikeReposiroty.findAll({
      where: {
        postId,
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


  async deletePULike(dto: PULikeReqDto) {
    const allPULikes = await this.getAllPULikes();
    if (!allPULikes.find(puLike => puLike.userId === dto.userId && puLike.postId === dto.postUserId)) {
      throw new HttpException('Такого лайка не существует', HttpStatus.BAD_REQUEST);
    }
    const puLike = await this.puLikeReposiroty.destroy({
      where: {
        userId: dto.userId,
        postId: dto.postUserId,
      }
    });
    return puLike;
  }
}
