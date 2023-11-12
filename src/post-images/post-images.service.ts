import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OnePostImage, PostImage } from './post-images.model';
import * as uuid from 'uuid';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { CreationsService } from 'src/creations/creations.service';
import { Comment } from 'src/comments/comments.model';
import { CrTypeCodes } from 'src/creations/creation-types.model';
import { Creation } from 'src/creations/creations.model';

@Injectable()
export class PostImagesService {

  constructor(
    @InjectModel(PostImage) private postImageRep: typeof PostImage,
    private creationsService: CreationsService,
  ) {}

  async getImageById(id: number) {
    const image = await this.postImageRep.findOne({
      where: {
        id,
      },
      include: [
        Creation,
      ]
    });
    return image;
  }

  async getOnePostImage(userId: number, postImage: PostImage) {
    const oneCreation = await this.creationsService.getOneCreationByCreation(userId, postImage.creation);
    const onePostImage: OnePostImage = {
      id: postImage.id,
      value: postImage.value,
      postId: postImage.postId,
      creationId: postImage.creationId,
      creation: oneCreation,
    }
    return onePostImage;
  }

  async getAllImagesByPostId(postId: number) {
    const images = await this.postImageRep.findAll({
      where: {
        postId,
      },
      include: [
        Comment,
        Creation
      ]
    });
    return images;
  }

  async createImage(file: Express.Multer.File, postId: number, authorId: number) {
    if (!file) {
      throw new HttpException('Нет файла нахуй', HttpStatus.BAD_REQUEST);
    }

    const imageName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', imageName), file.buffer);

    const creation = await this.creationsService.createCreation(authorId, CrTypeCodes.POST_IMAGE);
    const pImage = await this.postImageRep.create({value: imageName, postId, creationId: creation.id});
    return pImage;
  }
}
