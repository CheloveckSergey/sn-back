import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Roles } from './roles.model';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {

  constructor(@InjectModel(Roles) private rolesRepository: typeof Roles) {}

  async createRole(dto: CreateRoleDto) {
    return this.rolesRepository.create(dto);
  }

  async getAllRoles() {
    return this.rolesRepository.findAll();
  }

  async getRoleByValue(value: number) {
    return this.rolesRepository.findOne({where: {value: value}})
  }
}
