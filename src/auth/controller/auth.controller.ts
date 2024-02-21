import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { User, UserType } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ErrorMessage, SuccessMessage } from 'src/utils/responseUtils';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  // User registration API
  @Post('/register')

  async userRegister(@Body() userData: User): Promise<User> {

    try {
      const userRegister = await this.authService.userRegister(userData);

      return userRegister;

    } catch (error) {

      return error;
    }
  }

  // User login API
  @Post('/login')

  async userLogin(@Body() loginData: { email: string; password: string },): Promise<{ success: boolean; token?: string; userType?: UserType; userId?: string; error?: string }> {

    try {

      const user = await this.authService.findByEmail(loginData.email);

      if (!user) {

        throw new HttpException(ErrorMessage.unauthorizedError, HttpStatus.UNAUTHORIZED);

      }

      const isPasswordValid = await this.authService.verifyPassword(user, loginData.password);

      if (!isPasswordValid) {

        throw new HttpException(ErrorMessage.unauthorizedError, HttpStatus.UNAUTHORIZED);

      }

      const token = this.authService.generateToken(user);

      const userType = user.userType;

      const userId = user._id.toString();

      return { success: true, token, userType, userId };

    } catch (error) {

      return { success: false, error: 'Authentication failed' };
    }
  }

  // User forgot password API
  @Post('/forgot-password')

  async forgotUserPassword(@Body() requestParams: { email: string }): Promise<{ message: any }> {

    const user = await this.authService.findByEmail(requestParams.email);

    if (!user) {

      throw new HttpException(ErrorMessage.userNotFound, HttpStatus.NOT_FOUND);

    }

    await this.authService.sendPasswordResetEmail(user);

    return { message: SuccessMessage.forgotPasswordMail };
  }

  // User password reset API
  @Post('/reset-password')

  @UseGuards(JwtAuthGuard)

  async resetPassword(@Req() request: any, @Body() requestBody: { newPassword: string }): Promise<{ message: string, newToken?: string }> {

    try {
      if (!request.user || !request.user.userId) {

        console.log('Decoded token is missing');

        throw new HttpException('Decoded token is missing', HttpStatus.UNAUTHORIZED);
      }

      const userId = request.user.userId;
      const user = await this.authService.findById(userId);

      if (!user) {
        console.log('User:', user);
        throw new HttpException(ErrorMessage.userNotFound, HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(requestBody.newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      const newToken = this.authService.generateToken(user);

      console.log(newToken);
      console.log('Password reset successful');

      return { message: 'Password reset successful', newToken };

    } catch (error) {
      console.error('Error in resetPassword:', error);

      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
