import { Body, Controller, Post, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('/registration')
  async registration(
    @Body() userDto: CreateUserDto,
    @Response() res
  ) {
    const authDto = await this.authService.registration(userDto);
    res.cookie(
      'refreshToken', 
      authDto.tokens.refreshToken, 
      {
        maxAge: 1 * 60 * 60 * 1000, 
        httpOnly: true
      }
    );
    return res.send({
      id: authDto.id, 
      login: authDto.login, 
      accessToken: authDto.tokens.accessToken, 
      avatar: authDto.avatar,
      author: authDto.author,
    });
  }

  @Post('/login')
  async login(
    @Body() userDto: CreateUserDto,
    @Response() res
  ) {
    const authDto = await this.authService.login(userDto);
    res.cookie('refreshToken', authDto.tokens.refreshToken, {maxAge: 1 * 60 * 60 * 1000, httpOnly: true});
    return res.send({id: authDto.id, login: authDto.login, accessToken: authDto.tokens.accessToken, avatar: authDto.avatar, author: authDto.author});
  }

  @Post('/refresh')
  async refresh(
    @Request() req 
  ) {
    const refreshToken = req.cookies;
    console.log(refreshToken?.refreshToken);
    const authDto = await this.authService.refresh(refreshToken?.refreshToken);
    return {id: authDto.id, login: authDto.login, accessToken: authDto.tokens.accessToken, avatar: authDto.avatar, author: authDto.author}
  }

  @Post('/logout')
  async logout(
    @Body() {userId} : {userId: number},
    @Response() res
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken');
    console.log('ОЧИСТКА КАКАШКИ');
    return res.send({message: 'Выход успешно произведён'});
  }
}
