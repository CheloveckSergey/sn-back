import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './group.model';
import { GroupDesc } from './group-desc.model';
import { AuthorModule } from 'src/author/author.module';
import { GMType } from './gmTypes.model';
import { GroupMember } from './group-members.model';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    SequelizeModule.forFeature([
      Group, 
      GroupDesc, 
      GMType,
      GroupMember,
    ]),
    AuthorModule,
  ],
  exports: [
    GroupService,
  ]
})
export class GroupModule {}
