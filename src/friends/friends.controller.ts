import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('friends')
export class FriendsController {

  constructor(
    private friendshipService: FriendsService
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('/createFriendship')
  // async createFriendship(
  //   @Body() dto: { userId1: number, userId2: number },
  //   @Req() req,
  // ) {
  //   return this.friendshipService.createFriendship(dto.userId1, dto.userId2);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/deleteFriendship/:userId')
  async deleteFriendship(
    @Param('userId') userId: number,
    @Req() req,
  ) {
    return this.friendshipService.deleteFriend(req.userPayload.id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getPossibleFriends/:userId')
  async getPossibleFriends(
    @Req() req,
    @Param('userId') userId: number,
  ) {
    return this.friendshipService.getPossibleFriends(userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/getAllFriends/:userId')
  async getAllFriends(
    @Req() req,
    @Param('userId') userId: number,
  ) {
    return this.friendshipService.getFriendsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancelDeleteFriend')
  async cancelDeleteFriend(
    @Req() req,
    @Body() dto: {
      userId1: number,
      userId2: number,
    },
  ) {
    return this.friendshipService.cancelDeleteFriend(dto.userId1, dto.userId2);
  }

  ////////////////////////////////////////////////////////////////////

  @UseGuards(JwtAuthGuard)
  @Get('/getAllActiveOutcomeRequestsByUser/:userId')
  async getAllActiveOutcomeRequestsByUser(
    @Req() req,
    @Param('userId') userId: number,
  ) {
    return this.friendshipService.getAllActiveOutcomeRequestsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllActiveIncomeRequestsByUser/:userId')
  async getAllActiveIncomeRequestsByUser(
    @Req() req,
    @Param('userId') userId: number,
  ) {
    return this.friendshipService.getAllActiveIncomeRequestsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createRequest')
  async createRequest(
    @Req() req,
    @Body() dto: {
      userId1: number,
      userId2: number,
    },
  ) {
    return this.friendshipService.createRequest(dto.userId1, dto.userId2);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/rejectRequest')
  async rejectRequest(
    @Req() req,
    @Body() dto: {
      requestId: number
    },
  ) {
    return this.friendshipService.rejectRequest(dto.requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/acceptRequest')
  async acceptRequest(
    @Req() req,
    @Body() dto: {
      requestId: number
    },
  ) {
    return this.friendshipService.acceptRequest(dto.requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/deleteRequest')
  async deleteRequest(
    @Req() req,
    @Body() dto: {
      requestId: number
    },
  ) {
    return this.friendshipService.deleteRequestById(dto.requestId);
  }
}
