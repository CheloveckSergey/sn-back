import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomType } from './rooms.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('rooms')
export class RoomsController {

  constructor(private roomService: RoomsService) { }

  @Get('/getRoomById/:id')
  async getRoomById(
    @Param('id') id: number,
  ) {
    return this.roomService.getRoomById(id);
  }

  @Get('/getAllRoomsByUserId/:id')
  async getAllRoomsByUserId(
    @Param('id') id: number,
  ) {
    console.log('userId: ' + id);
    return this.roomService.getAllRoomsByUserId(id);
  }

  @Post('/getPersonalRoom')
  async getPersonalRoom(
    @Body() dto: { userId1: number, userId2: number },
  ) {
    return this.roomService.getPersonalRoom(dto.userId1, dto.userId2);
  }

  @Post('/getAllPossibleMembers')
  async getAllPossibleMembers(
    @Body() dto: { userId: number, roomId: number }
  ) {
    return this.roomService.getAllPossibleMembers(dto.roomId, dto.userId);
  }

  @Get('/getAllMembersByRoom/:roomId')
  async getAllMembersByRoom(
    @Param('roomId') roomId: number
  ) {
    return this.roomService.getAllMembersByRoom(roomId);
  }

  @Post('/createRoom')
  async createRoom(
    @Body() dto: { userId: number, type: RoomType }
  ) {
    return this.roomService.createRoom(dto.userId, dto.type);
  }

  @UseInterceptors(FileInterceptor('img'))
  @Post('/createGeneralRoom')
  async createGeneralRoom(
    @Body() dto: {
      adminId: number,
      name: string,
      userIds: number[] | undefined,
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    //Из-за того, что нельзя послать пустой массив в каком то поле, здесь может быть undefined
    let userIds;
    if (!dto.userIds) {
      userIds = [];
    } else {
      userIds = dto.userIds;
    }
    return this.roomService.createGeneralRoom(dto.adminId, dto.name, userIds, file);
  }

  @Post('/createPersonalRoom')
  async createPersonalRoom(
    @Body() dto: { userId1: number, userId2: number }
  ) {
    return this.roomService.createPersonalRoom(dto.userId1, dto.userId2);
  }

  @Post('/createPRoomAndWMessage')
  async createPRoomAndWMessage(
    @Body() dto: {
      userId1: number,
      userId2: number,
      text: string,
    }
  ) {
    return this.roomService.createPRoomAndWMessage(dto.userId1, dto.userId2, dto.text);
  }

  @Post('/addRoomMember')
  async addRoomMember(
    @Body() dto: { userId: number, roomId: number }
  ) {
    return this.roomService.addRoomMember(dto.userId, dto.roomId);
  }

  @Post('/addRoomMembers')
  async addRoomMembers(
    @Body() dto: { userIds: number[], roomId: number }
  ) {
    return this.roomService.addRoomMembers(dto.userIds, dto.roomId);
  }

  @Post('/deleteRoomMember')
  async deleteRoomMember(
    @Body() dto: { userId: number, roomId: number }
  ) {
    return this.roomService.deleteRoomMember(dto.userId, dto.roomId);
  }
}
