import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { SignUpDto } from '../dto/signup.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //used to register a new user
  @Post('/register')
  signUp(@Body() signUpDto: SignUpDto): Promise<User> {
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
  @Get(':id')
  async getUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.findbyId(id);
  }
  @Patch(':id/update')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateById(id, updateUserDto);
  }
  @Delete(':id/delete')
  async deleteUserById(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.userService.deleteById(id);
      return { message: 'User has been deleted' };
    } catch (error) {
      // Handle specific error cases if needed
      if (error instanceof NotFoundException) {
        // Handle NotFoundException, for example:
        return { message: 'User not found' };
      }
      // Handle other errors
      return { message: 'Failed to delete user' };
    }
  }
}
