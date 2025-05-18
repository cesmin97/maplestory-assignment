/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { RewardType } from '../schema/reward.schema';

export class CreateRewardDto {
  @IsEnum(RewardType, { message: '유효하지 않은 보상 유형입니다.' })
  type: RewardType;

  @IsString({ message: '보상 명은 문자열만 허용됩니다.' })
  @IsNotEmpty({ message: '보상 명은 필수입니다.' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: '수량 값은 필수입니다.' })
  @Min(1, { message: '수량 값은 최소 1 이상이어야 합니다.' })
  amount: number;

  @IsString({ message: '보상 설명은 문자열만 허용됩니다.' })
  @IsNotEmpty({ message: '보상 설명은 필수입니다.' })
  description: string;

  @IsBoolean({ message: '활성화 여부는 boolean 값만 허용됩니다.' })
  isActivate: boolean;
}
