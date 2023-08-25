import { Controller, Get, Param, Post } from '@nestjs/common';
import { FileService } from 'src/users/file.service';
import { UsersService } from 'src/users/users.service';
import { UserDescService } from './user-desc.service';

@Controller('user-desc')
export class UserDescController {

  constructor(
    private userDescService: UserDescService,
  ) {}

  @Get('getDesc/:id')
  async getDesc(
    @Param('id') id: number
  ) {
    return this.userDescService.getDesc(id);
  }

  @Post('/createNewDesc/:id')
  async createNewDesc(
    @Param('id') id: number
  ) {
    return this.userDescService.createDesc({userId: id});
  }
}
