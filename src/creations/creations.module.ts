import { Module } from '@nestjs/common';
import { CreationsController } from './creations.controller';
import { CreationsService } from './creations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreationType } from './creation-types.model';
import { Creation } from './creations.model';

@Module({
  controllers: [CreationsController],
  providers: [CreationsService],
  imports: [
    SequelizeModule.forFeature([
      CreationType,
      Creation,
    ]),
  ],
  exports: [CreationsService],
})
export class CreationsModule {}
