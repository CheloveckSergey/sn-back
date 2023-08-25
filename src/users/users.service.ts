import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import * as uuid from 'uuid';
import { writeFile } from "fs/promises";
import * as path from "path";

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue(2);
    user.$set('roles', [role.id]);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({include: {all: true}});
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({where: {id}});
    return user;
  }

  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({where: {login}});
    return user;
  }

  async getAvatarById(id: number) {
    const avatar = await this.userRepository.findOne({
      where: {id},
      attributes: ['avatar'],
    });
    return avatar;
  }

  async createAvatar(id: number, file: Express.Multer.File) {
    const avatarName = uuid.v4() + '.jpg';
    await writeFile(path.resolve('src', 'static', avatarName), file.buffer);
    await this.userRepository.update(
      {avatar: avatarName},
      {
        where: {
          id
        }
      }
    );
    return {message: 'Ну вроде нормал'};
  }
}
