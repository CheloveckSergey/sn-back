import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FileService } from 'src/users/file.service';
import { UsersService } from 'src/users/users.service';
import { UserDescService } from './user-desc.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user-desc')
export class UserDescController {

  constructor(
    private userDescService: UserDescService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/getDesc')
  async getDesc(
    @Req() req,
  ) {
    return this.userDescService.getDesc(req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createNewDesc')
  async createNewDesc(
    @Req() req,
  ) {
    return this.userDescService.createDesc(req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateDate')
  async updateDate(
    @Req() req,
    @Body() dto: { date: string }
  ) {
    console.log(dto);
    return this.userDescService.updateDate(dto.date, req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateFamilyStatus')
  async updateFamilyStatus(
    @Req() req,
    @Body() dto: { familyStatus: string }
  ) {
    console.log(dto);
    return this.userDescService.updateFamilyStatus(dto.familyStatus, req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateWork')
  async updateWork(
    @Req() req,
    @Body() dto: { work: string }
  ) {
    console.log(dto);
    return this.userDescService.updateWork(dto.work, req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateTelephone')
  async updateTelephone(
    @Req() req,
    @Body() dto: { telephone: string }
  ) {
    return this.userDescService.updateTelephone(dto.telephone, req.userPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateQuote')
  async updateQuote(
    @Req() req,
    @Body() dto: { quote: string }
  ) {
    return this.userDescService.updateQuote(dto.quote, req.userPayload.id);
  }
}
