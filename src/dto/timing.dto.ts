import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTimingDto {
  

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
  
  @IsNotEmpty()
  @IsString()
  shop:string;
}

export class UpdateTimingDto {
  
  @IsNotEmpty()
  @IsBoolean()
  disabled?: boolean;
}