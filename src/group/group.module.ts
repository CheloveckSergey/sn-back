import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './group.model';
import { GroupSubscriber } from './group-subscriber.model';
import { GroupDesc } from './group-desc.model';
import { UsersModule } from 'src/users/users.module';
import { GroupModerator } from './group-moderator.mode';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    SequelizeModule.forFeature([Group, GroupSubscriber, GroupDesc, GroupModerator]),
    UsersModule,
  ]
})
export class GroupModule {}
