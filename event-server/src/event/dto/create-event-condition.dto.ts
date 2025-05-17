/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { EventConditionType } from '../schema/event-condition.schema';

export class CreateEventConditionDto {
  @IsEnum(EventConditionType, { message: '유효하지 않은 조건 유형입니다.' })
  type: EventConditionType;

  @IsNumber()
  @IsNotEmpty({ message: '조건 값은 필수입니다.' })
  @Min(1, { message: '조건 값은 최소 1 이상이어야 합니다.' })
  value: number;

  @IsString({ message: '조건 설명은 문자열만 허용됩니다.' })
  @IsNotEmpty({ message: '조건 설명은 필수입니다.' })
  description: string;

  @IsMongoId({ message: '유효하지 않은 이벤트 ID입니다.' })
  @IsNotEmpty({ message: '이벤트 ID는 필수입니다.' })
  eventId: string;

  @IsBoolean({ message: '활성화 여부는 boolean 값만 허용됩니다.' })
  isActivate: boolean;
}
