import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './comments.model';
import { CreationsModule } from 'src/creations/creations.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    SequelizeModule.forFeature([
      Comment,
    ]),
    CreationsModule,
  ],
})
export class CommentsModule {}
