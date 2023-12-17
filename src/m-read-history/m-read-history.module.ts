import { Module } from '@nestjs/common';
import { MReadHistoryController } from './m-read-history.controller';
import { MReadHistoryService } from './m-read-history.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MReadHistory } from './m-read-history.model';

@Module({
  controllers: [MReadHistoryController],
  providers: [MReadHistoryService],
  imports: [
    SequelizeModule.forFeature([
      MReadHistory,
    ])
  ],
  exports: [
    MReadHistoryService,
  ]
})
export class MReadHistoryModule {}
