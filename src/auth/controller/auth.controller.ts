import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { User } from '../../schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user')
  async create(@Body() user: User): Promise<User> {
    return this.authService.create(user);
  }

  @Post('/login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ token: string }> {
    const user = await this.authService.findByEmail(credentials.email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.authService.verifyPassword(
      user,
      credentials.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Assuming you have a method in your AuthService to generate a JWT token
    const token = this.authService.generateToken(user);
    return { token };
  }
}
