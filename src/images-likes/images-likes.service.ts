import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ImageLike } from './images-likes.model';

@Injectable()
export class ImagesLikesService {

  constructor(
    @InjectModel(ImageLike) private imageLikeReposiroty: typeof ImageLike,
  ) {}

  private async getAllILikes() {
    const allILikes = await this.imageLikeReposiroty.findAll();
    return allILikes;
  }

  async getAllILikesByImageId(imageId: number) {
    const iLikes = await this.imageLikeReposiroty.findAll({
      where: {
        imageId,
      }
    });
    return iLikes;
  }

  async getAllILikesByUserId(userId: number) {
    const iLikes = await this.imageLikeReposiroty.findAll({
      where: {
        userId,
      }
    });
    return iLikes;
  }

  async createILike(userId: number, imageId: number) {
    const allILikes = await this.getAllILikes();
    if (allILikes.find(iLike => iLike.userId === userId && iLike.imageId === imageId)) {
      throw new HttpException('Такой лайк уже существует', HttpStatus.BAD_REQUEST);
    }
    const iLike = await this.imageLikeReposiroty.create({imageId, userId});
    return iLike;
  }

  async deleteILike(userId: number, imageId: number) {
    const allILikes = await this.getAllILikes();
    if (!allILikes.find(iLike => iLike.userId === userId && iLike.imageId === imageId)) {
      throw new HttpException('Такого лайка не существует', HttpStatus.BAD_REQUEST);
    }
    const iLike = await this.imageLikeReposiroty.destroy({
      where: {
        userId,
        imageId,
      }
    });
    return iLike;
  }
}
