import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Creation } from './creations.model';
import { CrTypeCodes, CrTypesNames, CreationType } from './creation-types.model';
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
    console.log('CREATE_CREATION');
    console.log('AUTHOR_ID: ' + authorId + ' ' + typeof authorId);
    console.log('TYPE_ID: ' + creationType.id + ' ' + typeof creationType.id);
    let creation: Creation;
    try {
      creation = await this.creationRep.create({
        authorId,
        typeId: creationType.id,
      });
    } catch (error) {
      console.log(error);
    }
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

  async createCrType(crTypeCode: CrTypeCodes, crTypeName: CrTypesNames) {
    if (!Object.values(CrTypeCodes).includes(crTypeCode)) {
      throw new HttpException('Такого кода типа творения не существует', HttpStatus.BAD_REQUEST);
    }
    if (!Object.values(CrTypesNames).includes(crTypeName)) {
      throw new HttpException('Такого имени типа творения не существует', HttpStatus.BAD_REQUEST);
    }

    const codeCandidate = await this.creationTypeRep.findOne({
      where: {
        code: crTypeCode,
      }
    });
    if (codeCandidate) {
      throw new HttpException('Тип с таким кодом уже существует', HttpStatus.BAD_REQUEST);
    }
    const nameCandidate = await this.creationTypeRep.findOne({
      where: {
        name: crTypeName,
      }
    });
    if (nameCandidate) {
      throw new HttpException('Тип с таким именем уже существует', HttpStatus.BAD_REQUEST);
    }

    const creationType = await this.creationTypeRep.create({ code: crTypeCode, name: crTypeName });
    return creationType;
  }
}
