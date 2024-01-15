import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Payload } from 'src/auth/dto/auth.dto';

@Controller('users')
export class UsersController {

  constructor(
    private userService: UsersService,
    private fileService: FileService
  ) {}

  @Post('/create')
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get('/get/:login')
  getOne(@Param('login') login: string) {
    return this.userService.getUserByLogin(login);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getUserById/:id')
  getUserById(
    @Param('id') id: number,
    @Req() req,
  ) {
    return this.userService.getUserById(id, req.userPayload.id);
  }

  //Проблема со экспортами друзей и юзеров
  // @UseGuards(JwtAuthGuard)
  // @Get('/getOneUserById/:id')
  // getOneUserById(
  //   @Param('id') id: number,
  //   @Req() req: { userPayload: Payload },
  // ) {
  //   return this.userService.getOneUserById(id, req.userPayload.id);
  // }

  // @Get('/avatar/:id')
  // getAvatar(@Param('id') id: number) {
  //   return this.userService.getAvatarById(id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/createAvatar')
  // @UseInterceptors(FileInterceptor('img', { dest: './uploads' }))
  @UseInterceptors(FileInterceptor('img'))
  async createAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Query('folder') folder?: string,
  ) {
    const newFile = await this.userService.createAvatar(req.userPayload.id, file);
    return newFile;
  }

  // @Get('/getAllSubsByAuthorId/:authorId')
  // async getAllSubsByAuthorId(
  //   @Param('authorId') authorId: number,
  // ) {
  //   return this.userService.getAllSubsByAuthorId(authorId);
  // }
}
