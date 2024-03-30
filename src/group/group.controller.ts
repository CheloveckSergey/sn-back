import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, DeleteGrouDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Payload } from 'src/auth/dto/auth.dto';

@Controller('groups')
export class GroupController {

  constructor(private groupService: GroupService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/getAllGroups')
  async getAllGroups(
    @Req() req: {
      userPayload: Payload,
    }
  ) {
    return this.groupService.getAllGroups(req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getGroupById/:id')
  async getGroupById(
    @Param('id') id: number,
    @Req() req: {
      userPayload: Payload,
    }
  ) {
    return this.groupService.getGroupById(id, req.userPayload.id);
  }

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
