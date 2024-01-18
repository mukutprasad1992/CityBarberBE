import { IsNotEmpty, IsString, IsOptional, IsPhoneNumber, IsPostalCode } from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsPhoneNumber(undefined || null, { message: 'Primary phone number is invalid' })
  primaryPhoneNumber: string;

  @IsOptional()
  @IsPhoneNumber(undefined || null, { message: 'Secondary phone number is invalid' })
  secondaryPhoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsPostalCode('any', { message: 'Pincode is invalid' })
  pincode: string;

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
