import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Creation } from './creations.model';
import { CrTypeCodes, CreationType } from './creation-types.model';
import { Op } from 'sequelize';

@Injectable()
export class CreationsService {

  constructor(
    @InjectModel(Creation) private creationRep: typeof Creation,
    @InjectModel(CreationType) private creationTypeRep: typeof CreationType,
  ) {}

  async getCreationById(id: number) {
    const creation = await this.creationRep.findOne({
      where: {
        id,
      }
    });
    return creation;
  }

  async getTCreationsByAuthorId(typeCode: CrTypeCodes, authorId: number) {
    const type = await this.creationTypeRep.findOne({
      where: {
        code: typeCode,
      }
    });
    const creations = await this.creationRep.findAll({
      where: {
        authorId,
        typeId: type.id,
      }
    });
    return creations;
  }

  async getTCreationsByAuthorIds(typeCode: CrTypeCodes, authorIds: number[]) {
    const type = await this.creationTypeRep.findOne({
      where: {
        code: typeCode,
      }
    });
    const creations = await this.creationRep.findAll({
      where: {
        authorId: {
          [Op.or]: authorIds,
        },
        typeId: type.id,
      }
    });
    return creations;
  }

  async createCreation(authorId: number, crTypeCode: CrTypeCodes) {
    const creationType = await this.getCrType(crTypeCode);
    const creation = await this.creationRep.create({
      authorId,
      typeId: creationType.id,
    });
    return creation;
  }

  async deleteCreationById(id: number) {
    const creation = await this.getCreationById(id);
    creation.destroy();
  }

  async getCrType(crTypeCode: CrTypeCodes) {
    const creationType = await this.creationTypeRep.findOne({
      where: {
        code: crTypeCode,
      }
    });
    return creationType;
  }
}
