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
    const desc = await this.userDescRepository.findOne({
      where: {
        userId
      }
    });
    return desc;
  }

  async createDesc({ data, city, familyStatus, work, telephone, quote, userId } : CreateUserDescDto) {
    const response = await this.userDescRepository.create({userId, data, city, familyStatus, work, telephone, quote});
    return response
  }

  async updateData(data: string | undefined, userId: number) {
    if (data) {
      await this.userDescRepository.update(
        {
          data
        }, {
          where: {
            userId: userId
          }
        }
      )
    }
  }

  async updateFamilyStatus(familyStatus: string | undefined, userId: number) {
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
