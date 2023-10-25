import { Body, Controller, Post } from '@nestjs/common';
import { CreationsService } from './creations.service';
import { CrTypeCodes, CrTypesNames } from './creation-types.model';

@Controller('creations')
export class CreationsController {

  constructor(private creationsService: CreationsService) {}
  
  @Post('/createType')
  async createType(
    @Body() dto: { code: CrTypeCodes, name: CrTypesNames }
  ) {
    return this.creationsService.createCrType(dto.code, dto.name);
  }
}
