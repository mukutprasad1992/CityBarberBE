import { IsEmail, IsNotEmpty, IsString,IsIn, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['consumer', 'provider'], { message: 'Invalid userType. Must be either "consumer" or "provider".' })
  readonly userType: string;
}
