import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { SignUpDto } from '../dto/signup.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //   @Get()
  //   async getAllUsers(): Promise<User[]> {
  //     return this.userService.findAll();
  //   }
  //used to register a new user

  @Post('/register')
  signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.userService.register(signUpDto);
  }
}
