import { Module } from '@nestjs/common';
import { CreationsController } from './creations.controller';
import { CreationsService } from './creations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreationType } from './creation-types.model';
import { Creation } from './creations.model';
import { AuthorModule } from 'src/author/author.module';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  controllers: [CreationsController],
  providers: [CreationsService],
  imports: [
    SequelizeModule.forFeature([
      CreationType,
      Creation,
    ]),
    AuthorModule,
    LikesModule,
  ],
  exports: [CreationsService],
})
export class CreationsModule {}
