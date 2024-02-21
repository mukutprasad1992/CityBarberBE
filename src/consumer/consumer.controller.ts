import { Controller, Body, Post, NotFoundException, Get, Patch, Delete, UseGuards, Req, HttpException, HttpStatus, Res, } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto, UpdateConsumerDto } from 'src/dto/consumer.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { ErrorMessage, SuccessMessage } from 'src/utils/responseUtils';

@Controller('consumer')
export class ConsumerController {

  constructor(private readonly consumerService: ConsumerService) { }

  // Endpoint to create a new consumer
  @Post('/create_consumer')

  @UseGuards(JwtAuthGuard)

  async createConsumer(@Body() createConsumerDto: CreateConsumerDto, @Req() req): Promise<{ message: any, consumer: any }> {

    try {

      // Extract user ID from the request
      const userId = req.user.user || req.user.userId;

      // Extract user type from the request
      const userType = req.user.userType;

      // Check if the user is of type 'consumer'
      if (userType !== 'consumer') {

        throw new NotFoundException('User does not have the required userType of consumer');

      }

      // Call the consumer service to create a new consumer
      const consumerDetails = await this.consumerService.createConsumer(createConsumerDto, userId);

      return { message: SuccessMessage.consumerCreatedSuccessfully, consumer: consumerDetails }

    } catch (error) {

      // Handle different types of errors and throw appropriate HTTP exceptions
      if (error instanceof NotFoundException) {

        throw new HttpException(error.message || ErrorMessage.consumerNotFound, HttpStatus.NOT_FOUND);

      } else if (error instanceof HttpException) {

        throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

      } else {

        if (error.message.includes('Consumer details already exist for this user')) {

          throw new HttpException(ErrorMessage.consumerAlreadyExists, HttpStatus.BAD_REQUEST);

        } else {

          throw new HttpException(ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

        }
      }
    }
  }

  // Endpoint to get all consumers
  @Get('/getall')

  async getAllConsumers(): Promise<{ message: any, consumer: any }> {

    try {

      // Call the consumer service to get all consumers
      const getAllConsumers = await this.consumerService.getAllConsumers();

      return { message: SuccessMessage.getAllConsumers, consumer: getAllConsumers }

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      if (error instanceof HttpException) {

        throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

      } else {

        console.error('Unhandled error in getAllConsumers:', error);

        throw new HttpException(ErrorMessage.internalServer, HttpStatus.INTERNAL_SERVER_ERROR);

      }
    }
  }

  // Endpoint to get consumer profile
  @Get('/get/profile')

  @UseGuards(JwtAuthGuard)

  async getConsumerProfile(@Req() req): Promise<{ message: any, consumer: any }> {

    try {

      // Extract user ID from the request
      const userId = req.user.userId;

      // Extract user type from the request
      const userType = req.user.userType;

      // Check if the user is of type 'consumer'
      if (userType !== 'consumer') {

        throw new NotFoundException(ErrorMessage.userType.statusCode);

      }

      // Call the consumer service to get consumer profile by ID
      const getConsumerProfile = await this.consumerService.getConsumerById(userId);

      return { message: SuccessMessage.consumerProfile, consumer: getConsumerProfile }

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      if (error instanceof NotFoundException) {

        throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

      } else {

        throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

      }
    }
  }

  // Endpoint to update consumer profile
  @Patch('/update')

  @UseGuards(JwtAuthGuard)

  async updateConsumerProfile(@Body() updateConsumerDto: UpdateConsumerDto, @Req() req, @Res() res,): Promise<{ message: any, consumer: any }> {

    try {

      // Extract user ID from the request
      const userId = req.user.userId;

      // Extract user type from the request
      const userType = req.user.userType;

      // Check if the user is of type 'consumer'
      if (userType !== 'consumer') {

        throw new HttpException(ErrorMessage.userType, HttpStatus.FORBIDDEN);

      }

      // Call the consumer service to update consumer profile
      const updatedConsumer = await this.consumerService.updateConsumer(userId, updateConsumerDto);

      return { message: SuccessMessage.updateConsumer, consumer: updatedConsumer }

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      if (error instanceof NotFoundException) {

        throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

      } else {

        console.error('Error updating consumer profile:', error);

        throw new HttpException(error.message || ErrorMessage.internalServer, HttpStatus.INTERNAL_SERVER_ERROR);

      }
    }
  }

  // Endpoint to delete consumer profile
  @Delete('delete')

  @UseGuards(JwtAuthGuard)

  async deleteConsumerProfile(@Req() req): Promise<{ message: any, consumer: any }> {

    try {

      // Extract user ID from the request
      const userId = req.user.userId;

      // Extract user type from the request
      const userType = req.user.userType;

      // Check if the user is of type 'consumer'
      if (userType !== 'consumer') {

        throw new NotFoundException(ErrorMessage.userType);

      }

      // Call the consumer service to delete consumer profile
      const deleteConsumer = await this.consumerService.deleteConsumer(userId);

      return { message: SuccessMessage.deleteConsumer, consumer: deleteConsumer }

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      if (error instanceof NotFoundException) {

        throw new HttpException(ErrorMessage.consumerNotFound, HttpStatus.NOT_FOUND);

      } else {

        throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

      }
    }
  }
}
