// consumer/consumer.dto.ts

import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateConsumerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

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
