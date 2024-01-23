// consumer/consumer.dto.ts

import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateConsumerDto {
  @IsNotEmpty()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  phoneNo: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
