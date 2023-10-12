import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDesc } from './user-desc.model';
import { CreateUserDescDto } from './dto/create-user-desc.dto';

@Injectable()
export class UserDescService {

  constructor(
    @InjectModel(UserDesc) private userDescRepository: typeof UserDesc
  ) {}

  async getDesc(userId: number) {
    let desc;
    desc = await this.userDescRepository.findOne({
      where: {
        userId
      }
    });
    if (!desc) {
      desc = await this.createDesc(userId);
    }
    return desc;
  }

  async createDesc(userId: number) {
    const response = await this.userDescRepository.create({userId: userId});
    return response;
  }
  // async createDesc({ data, city, familyStatus, work, telephone, quote, userId } : CreateUserDescDto) {
  //   const response = await this.userDescRepository.create({userId, data, city, familyStatus, work, telephone, quote});
  //   return response
  // }

  async checkDescExistence(userId: number) {
    const desc = await this.getDesc(userId);
    if (!desc) {
      await this.createDesc(userId);
    }
  }

  async updateDate(date: string | undefined, userId: number) {
    await this.checkDescExistence(userId);
    console.log(date);
    if (date) {
      await this.userDescRepository.update(
        {
          date
        }, {
          where: {
            userId
          }
        }
      )
    }
    return {message: 'Дата успешно обновлена'}
  }

  async updateFamilyStatus(familyStatus: string | undefined, userId: number) {
    await this.checkDescExistence(userId);
    console.log("FAMILY STATUS");
    console.log(familyStatus);
    if (familyStatus) {
      await this.userDescRepository.update(
        {
          familyStatus
        }, {
          where: {
            userId: userId
          }
        }
      )
    }
  }

  async updateWork(work: string | undefined, userId: number) {
    await this.checkDescExistence(userId);
    if (work) {
      await this.userDescRepository.update(
        {
          work
        }, {
          where: {
            userId: userId
          }
        }
      )
    }
  }

  async updateTelephone(telephone: string | undefined, userId: number) {
    await this.checkDescExistence(userId);
    if (telephone) {
      await this.userDescRepository.update(
        {
          telephone
        }, {
          where: {
            userId: userId
          }
        }
      )
    }
  }

  async updateQuote(quote: string | undefined, userId: number) {
    await this.checkDescExistence(userId);
    if (quote) {
      await this.userDescRepository.update(
        {
          quote
        }, {
          where: {
            userId: userId
          }
        }
      )
    }
  }

  // async updateAllDesc(userDesc: CreateUserDescDto) {
  //   await this.updateData(user)
  // } 
}
