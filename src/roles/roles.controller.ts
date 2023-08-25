import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {

  constructor(private rolesSerivce: RolesService) {}

  @Post('/create')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesSerivce.createRole(dto);
  }

  @Get('/getAll')
  getAll() {
    return this.rolesSerivce.getAllRoles();
  }

  @Get('/getOne/:value')
  getOne(@Param('value') value: number) {
    return this.rolesSerivce.getRoleByValue(value);
  }

}
