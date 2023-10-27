import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, DeleteGrouDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('groups')
export class GroupController {

  constructor(private groupService: GroupService) {}

  @Get('/getAllGroups')
  async getAllGroups() {
    return this.groupService.getAllGroups();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/getGroupByName/:name')
  // async getGroupByName(
  //   @Param('name') name: string,
  //   @Req() req
  // ) {
  //   return this.groupService.getGroupByName(name, req.userPayload.id);
  // }

  @Get('/getGroupById/:id')
  async getGroupById(
    @Param('id') id: number
  ) {
    return this.groupService.getGroupById(id);
  }

  // @Get('/getAdminGroupsByUserId/:id')
  // async getAdminGroupsByUserId(
  //   @Param('id') id: number
  // ) {
  //   return this.groupService.getAdminGroupsByUserId(id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/createGroup')
  @UseInterceptors(FileInterceptor('img'))
  async createGroup(
    @Body() dto: { name: string, userId: number },
    @Req() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.groupService.createGroup(dto.userId, dto.name, file);
  }

  @Post('/deleteGroup')
  async deleteGroup(
    @Body() dto: {groupId: number}
  ) {
    return this.groupService.deleteGroup(dto.groupId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('/deleteGroupById')
  // async deleteGroupById(
  //   @Body() dto: DeleteGrouDto,
  //   @Req() req
  // ) {
  //   return this.groupService.deleteGroupById(dto.groupId, req.user.id);
  // }

  // @Get('/getSubsByGroupId/:groupId')
  // async getSubsByGroupId(
  //   @Param('groupId') groupId: number
  // ) {
  //   return this.groupService.getSubsByGroupId(groupId);
  // }

  // @Get('/getAllSubsByGroupId/:id')
  // async getAllSubsByGroupId(
  //   @Param('id') id: number
  // ) {
  //   return this.groupService.getAllSubsByGroupId(id);
  // }

  // @Post('/subscribe/:id')
  // async subscribe(
  //   @Param('id') id: number,
  //   @Req() req
  // ) {
  //   return this.groupService.subscribe(req.user.id, id);
  // }

  // @Post('/unsubscribe/:id')
  // async unsubscribe(
  //   @Param('id') id: number,
  //   @Req() req
  // ) {
  //   return this.groupService.subscribe(req.user.id, id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/createAvatar')
  @UseInterceptors(FileInterceptor('img'))
  async createAvatar(
    @Body() { groupName } : { groupName: string },
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const newFile = await this.groupService.createAvatar(req.userPayload.id, groupName, file);
    return newFile;
  }
}
