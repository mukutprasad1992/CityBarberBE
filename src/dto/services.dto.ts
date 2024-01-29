// create-service.dto.ts
import { IsString, IsNumber, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @IsNumber()
  servicePrice: number;

  @IsNotEmpty()
  @IsMongoId()
  shopId: string;

  @IsNotEmpty()
  @IsMongoId()
  providerId: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
