// create-slot-booking.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsMongoId, IsDate } from 'class-validator';

export class CreateSlotBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  shop: string;

  @IsMongoId()
  @IsNotEmpty()
  service: string;

  @IsMongoId()
  @IsNotEmpty()
  slot: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  slotTime: string;
}

export class UpdateSlotBookingDto extends PartialType(CreateSlotBookingDto) {}
