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
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { SignUpDto } from '../dto/signup.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import {
  createSuccessResponse,
  createErrorResponse,
  USER_DELETED_SUCCESS,
  USER_GET_All_SUCCESS,
  USER_GET_ID_SUCCESS,
  USER_UPDATE_SUCCESS,
} from 'src/utils/responseUtils';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //used to register a new user
  @Post('/register')
  async signUp(
    @Body(new ValidationPipe()) signUpDto: SignUpDto,
    @Res() res,
  ): Promise<void> {
    try {
      const response = await this.userService.register(signUpDto);

      if (response.success) {
        res
          .status(response.statusCode)
          .json(
            createSuccessResponse(
              response.user,
              response.message,
              response.token,
            ),
          );
      } else {
        res
          .status(response.statusCode)
          .json(createErrorResponse(response.message, null, response.user));
      }
    } catch (error) {
      if (error instanceof HttpException) {
        res
          .status(error.getStatus())
          .json(createErrorResponse(error.message, null, null));
      } else {
        res
          .status(500)
          .json(
            createErrorResponse('Internal Server Error', error.message, null),
          );
      }
    }
  }

  /* 
  CRUD Operations Controllers 
  */

  //Get all users use (/user/all)
  @Get('/all')
  async getAllUsers(@Res() res): Promise<void> {
    try {
      const result = await this.userService.findAll();
      res
        .status(200)
        .json(createSuccessResponse(result.user, USER_GET_All_SUCCESS));
    } catch (error) {
      res
        .status(500)
        .json(
          createErrorResponse('Internal Server Error', error.message, null),
        );
    }
  }
  //Get user by id use (/user/:id)
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req): Promise<{ success: boolean; user?: User }> {
    const userId = req.user.userId;

    try {
      // Assuming 'findbyId' method is correctly implemented
      const user = await this.userService.findbyId(userId);

      // Now you can access the user details
      // console.log(user);

      return createSuccessResponse(user, USER_GET_ID_SUCCESS);
    } catch (error) {
      // Handle the error, for example, log it
      console.error('Error retrieving user profile:', error);

      // Return an appropriate response
      return createErrorResponse('Internal Server Error', error.message, null);
    }
  }
  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ): Promise<void> {
    const userId = req.user.userId;

    try {
      const updatedUser = await this.userService.updateById(
        userId,
        updateUserDto,
      );
      res.status(HttpStatus.OK).json({ success: true, user: updatedUser });
    } catch (error) {
      // Handle specific error cases if needed
      if (error instanceof NotFoundException) {
        // Handle NotFoundException, for example:
        res.status(404).json(createErrorResponse('User not found', null, null));
      } else {
        console.error('Error updating user:', error);
        res.status(500).json(createErrorResponse('Failed to update user', null, null));
      }
    }
  }
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteUserById(@Req() req, @Res() res): Promise<void> {
    const userId = req.user.userId;

    try {
      await this.userService.deleteById(userId);
      res.status(200).json(createSuccessResponse(null, USER_DELETED_SUCCESS));
    } catch (error) {
      // Handle specific error cases if needed
      if (error instanceof NotFoundException) {
        // Handle NotFoundException, for example:
        res.status(404).json(createErrorResponse('User not found', null, null));
      }
      // Handle other errors
      console.error('Error deleting user:', error);
      res.status(500).json(createErrorResponse('Failed to delete user', null, null));
    }
  }
}
