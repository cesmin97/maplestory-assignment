/* eslint-disable prettier/prettier */
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { EventConditionType } from '../schema/event-condition.schema';
import { EventStatus } from '../schema/event.schema';
import { Type } from 'class-transformer';

class EventConditionDto {
  @IsEnum(EventConditionType, { message: '유효하지 않은 조건 유형입니다.' })
  type: EventConditionType;

  @IsNumber()
  @IsNotEmpty({ message: '조건 값은 필수입니다.' })
  @Min(1, { message: '조건 값은 최소 1 이상이어야 합니다.' })
  value: number;

  @IsString({ message: '조건 설명은 문자열만 허용됩니다.' })
  @IsNotEmpty({ message: '조건 설명은 필수입니다.' })
  description: string;

  @IsBoolean({ message: '활성화 여부는 boolean 값만 허용됩니다.' })
  isActivate: boolean;
}

export class CreateEventDto {
  @IsString({ message: '이벤트 명은 문자열만 허용됩니다.' })
  @IsNotEmpty({ message: '이벤트 명은 필수입니다.' })
  name: string;

  @IsString({ message: '이벤트 설명은 문자열만 허용됩니다.' })
  @IsNotEmpty({ message: '이벤트 설명은 필수입니다.' })
  description: string;

  @IsEnum(EventStatus, { message: '유효하지 않은 이벤트 상태입니다.' })
  status: EventStatus;

  @IsDate({ message: '이벤트 시작일은 날짜 형식만 허용됩니다.' })
  @IsNotEmpty({ message: '이벤트 시작일은 필수입니다.' })
  @Type(() => Date)
  startDate: Date;

  @IsDate({ message: '이벤트 종료일은 날짜 형식만 허용됩니다.' })
  @IsNotEmpty({ message: '이벤트 종료일은 필수입니다.' })
  @Type(() => Date)
  endDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventConditionDto)
  conditions: EventConditionDto[];
}
