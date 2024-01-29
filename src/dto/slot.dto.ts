// slot.dto.ts
import { IsNotEmpty, IsDateString } from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty()
  shop: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  // Add other validation rules as needed
}
