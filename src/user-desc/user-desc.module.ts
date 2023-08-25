import { Module } from '@nestjs/common';
import { UserDescController } from './user-desc.controller';
import { UserDescService } from './user-desc.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserDesc } from './user-desc.model';

@Module({
  controllers: [UserDescController],
  providers: [UserDescService],
  imports: [
    SequelizeModule.forFeature([UserDesc]),
  ],
  exports: [
    UserDescService,
  ]
})
export class UserDescModule {}
