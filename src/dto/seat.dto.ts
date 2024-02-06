// create-seat.dto.ts
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSeatDto {
  @IsNotEmpty()
  @IsMongoId()
  shopId: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => String)
  seatName: string[];
}
export class UpdateSeatDto extends PartialType(CreateSeatDto) {
  @IsNotEmpty()
  @IsArray()
  @Type(() => String)
  seatName: string[];
}
