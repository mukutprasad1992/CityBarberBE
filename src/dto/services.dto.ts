// create-service.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @IsNumber()
  servicePrice: number;

  @IsNotEmpty()
  @IsString()
  shop: string; // Assuming you'll send the shop ID as a string in the request body
}

// update-service.dto.ts

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
