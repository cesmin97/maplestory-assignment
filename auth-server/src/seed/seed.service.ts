/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { initialUsers } from './users.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async run() {
    this.logger.log('초기 사용자 데이터 시딩 시작...');

    for (const user of initialUsers) {
      const exists = await this.userModel.findOne({ email: user.email });
      if (exists) {
        this.logger.log(
          `사용자 '${user.email}' 은(는) 이미 존재합니다. 건너뜁니다.`,
        );
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await this.userModel.create({
        ...user,
        password: hashedPassword,
      });
      this.logger.log(`사용자 '${user.email}' 생성 완료.`);
    }

    this.logger.log('시딩 완료');
  }
}
