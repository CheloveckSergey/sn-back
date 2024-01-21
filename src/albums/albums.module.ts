import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { CreationsModule } from 'src/creations/creations.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Album } from './albums.model';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [
    SequelizeModule.forFeature([
      Album
    ]),
    CreationsModule,
  ],
  exports: [
    AlbumsService,
  ]
})
export class AlbumsModule {}
