// shop.dto.ts
import { IsNotEmpty, IsString, IsEnum, Matches } from 'class-validator';

// Regular expression to validate 24-hour time format
const timeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  shopName: string;

  @IsNotEmpty()
  @IsString()
  ownerName: string;

  @IsNotEmpty()
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  openingDay: string;

  @IsNotEmpty()
  @Matches(timeRegex, { message: 'Opening time must be in 24-hour format' })
  openingTime: string;

  @IsNotEmpty()
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  closingDay: string;

  @IsNotEmpty()
  @Matches(timeRegex, { message: 'Opening time must be in 24-hour format' })
  closingTime: Date;

  @IsString()
  shopImg: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
