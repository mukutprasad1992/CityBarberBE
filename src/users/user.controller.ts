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
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ user: User; token: string }> {
    return this.userService.register(signUpDto);
  }
  /* 
  CRUD Operations Controllers 
  */

  //Get all users use (/user/all)
  @Get('/all')
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
  //Get user by id use (/user/:id)
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req): Promise<User> {
    const userId = req.user.userId;

    try {
      // Assuming 'findbyId' method is correctly implemented
      const user = await this.userService.findbyId(userId);

      // Now you can access the user details
      console.log(user);

      return user;
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
  ): Promise<User> {
    const userId = req.user.userId;

    try {
      return await this.userService.updateById(userId, updateUserDto);
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
  async deleteUserById(@Req() req): Promise<{ message: string }> {
    const userId = req.user.userId;

    try {
      await this.userService.deleteById(userId);
      return { message: 'User has been deleted' };
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
