import { Module } from '@nestjs/common';
import { MusiciansController } from './musicians.controller';
import { MusiciansService } from './musicians.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Musician } from './musicians.model';
import { ServiceModule } from 'src/service/service.module';

@Module({
  controllers: [MusiciansController],
  providers: [MusiciansService],
  imports: [
    SequelizeModule.forFeature([Musician]),
    ServiceModule,
  ],
  exports: [
    MusiciansService,
  ]
})
export class MusiciansModule {}
