import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { SignUpDto } from '../dto/signup.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //used to register a new user
  @Post('/register')
  async signUp(@Body(new ValidationPipe()) signUpDto: SignUpDto): Promise<{
    statusCode?: number;
    message: string;
    success: boolean;
    user: User;
    token: string;
  }> {
    try {
      const response = await this.userService.register(signUpDto);

      if (response.success) {
        return {
          success: true,
          message: response.message,
          user: response.user,
          token: response.token,
        };
      } else {
        return {
          success: false,
          message: response.message,
          statusCode: response.statusCode,
          user: null,
          token: null,
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          success: false,
          message: error.message,
          statusCode: error.getStatus(),
          user: null,
          token: null,
        };
      } else {
        return {
          success: false,
          message: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          user: null,
          token: null,
        };
      }
    }
  }

  /* 
  CRUD Operations Controllers 
  */

  //Get all users use (/user/all)
  @Get('/all')
  async getAllUsers(): Promise<{ success: boolean; user: User[] }> {
    return this.userService.findAll();
  }
  //Get user by id use (/user/:id)
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req): Promise<{ success: true; user: User }> {
    const userId = req.user.userId;

    try {
      // Assuming 'findbyId' method is correctly implemented
      const user = await this.userService.findbyId(userId);

      // Now you can access the user details
      // console.log(user);

      return { success: true, user };
    } catch (error) {
      // Handle the error, for example, log it
      console.error('Error retrieving user profile:', error);

      // Return an appropriate response
      throw error;
    }
  }
  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ success: true; user: User }> {
    const userId = req.user.userId;

    try {
      const updatedUser = await this.userService.updateById(
        userId,
        updateUserDto,
      );
      return { success: true, user: updatedUser };
    } catch (error) {
      // Handle specific error cases if needed
      if (error instanceof NotFoundException) {
        // Handle NotFoundException, for example:
        throw { message: 'User not found', statusCode: 404 };
      }
      // Handle other errors
      throw { message: 'Failed to update user', statusCode: 500 };
    }
  }
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteUserById(
    @Req() req,
  ): Promise<{ success: true; message: string }> {
    const userId = req.user.userId;

    try {
      await this.userService.deleteById(userId);
      return { success: true, message: 'User has been deleted' };
    } catch (error) {
      // Handle specific error cases if needed
      if (error instanceof NotFoundException) {
        // Handle NotFoundException, for example:
        throw { message: 'User not found', statusCode: 404 };
      }
      // Handle other errors
      throw { message: 'Failed to delete user', statusCode: 500 };
    }
  }
}
