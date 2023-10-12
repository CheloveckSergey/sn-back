import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './refreshTokens.model';
import { AuthDto, RefreshDto, Tokens } from './dto/auth.dto';
import { UserDescService } from 'src/user-desc/user-desc.service';

interface TokenPayload {
  id: number,
  login: string,
  roles: number[],
}

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(RefreshToken) private refTokRepository: typeof RefreshToken,
    private userService: UsersService,
    private userDescService: UserDescService,
  ) {}

  async registration(dto: CreateUserDto): Promise<AuthDto> {
    const candidate = await this.userService.getUserByLogin(dto.login);
    if (candidate) {
      throw new HttpException('Пользователь с таким логином уже существует', HttpStatus.BAD_REQUEST);
    } 
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({...dto, password: hashPassword});
    const tokens = await this.generateTokens(user);
    const refreshToken = await this.refTokRepository.create({userId: user.id, token: tokens.refreshToken});
    await this.userDescService.createDesc(user.id);
    user.$set('refreshToken', refreshToken.id);
    return {id: user.id, login: user.login, tokens, avatar: user.avatar};
  }

  async login(dto: CreateUserDto): Promise<AuthDto> {
    const user = await this.userService.getUserByLogin(dto.login);
    if (!user) {
      throw new HttpException('Пользователь с таким логином не существует', HttpStatus.BAD_REQUEST);
    }
    const passwordRight = await bcrypt.compare(dto.password, user.password);
    if (!passwordRight) {
      throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
    }
    const tokens = await this.generateTokens(user);
    const refreshTok = await this.refTokRepository.findOne({
      where: {
        userId: user.id,
      }
    });
    if (refreshTok) {
      await this.refTokRepository.update({
        token: tokens.refreshToken
      }, {
        where: {
          userId: user.id
        }
      });
    } else {
      await this.refTokRepository.create({userId: user.id, token: tokens.refreshToken});
    }
    return {id: user.id, login: user.login, tokens, avatar: user.avatar};
  }

  async refresh(refreshToken: string): Promise<AuthDto> {
    if (!refreshToken) {
      throw new HttpException('Отсутствует рефрештокен', HttpStatus.BAD_REQUEST);
    }
    const refreshTok = await this.refTokRepository.findOne({
      where: {
        token: refreshToken
      }
    });
    if (!refreshTok) {
      throw new HttpException('Такого рефрештокена нет в базе данных', HttpStatus.BAD_REQUEST);
    }
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new HttpException('Рефрештокен не прошёл валидацию', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserByLogin(payload.login);
    const tokens = await this.generateTokens(user);
    return {id: user.id, login: user.login, tokens, avatar: user.avatar};
  }

  async logout(userId: number) {
    const refreshTok = await this.refTokRepository.destroy({
      where: {
        userId
      }
    });
    console.log(refreshTok);
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const payload = {
      id: user.id,
      login: user.login,
      roles: user.roles,
    }
    const accessToken = jwt.sign(payload, 'accessKey', {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, 'refreshKey', {expiresIn: '2h'});
    return {accessToken, refreshToken}; 
  }

  private verifyRefreshToken(refreshToken: string): TokenPayload | null {
    try {
      const payload: TokenPayload = jwt.verify(refreshToken, 'refreshKey');
      return payload;
    } catch (error) {
      return null;
    }
  }
}
