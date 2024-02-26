import { Module } from '@nestjs/common';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Music } from './musics.model';
import { MusiciansModule } from 'src/musicians/musicians.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  controllers: [MusicsController],
  providers: [MusicsService],
  imports: [
    SequelizeModule.forFeature([Music]),
    MusiciansModule,
    ServiceModule,
  ]
})
export class MusicsModule {}
