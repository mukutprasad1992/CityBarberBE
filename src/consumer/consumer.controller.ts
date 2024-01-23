import {
  Controller,
  Body,
  Post,
  NotFoundException,
  Get,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto } from 'src/dto/consumer.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createConsumer(
    @Body() createConsumerDto: CreateConsumerDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const userType = req.user.userType; // Make sure to get userType from req.user

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      const consumer = await this.consumerService.create(
        createConsumerDto,
        userId,
      );
      return { message: 'Consumer created successfully', consumer };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to create consumer');
    }
  }
  @Get('all')
  async getAllConsumers() {
    return this.consumerService.getAllConsumers();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getConsumerProfile(@Req() req) {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      return await this.consumerService.getConsumerById(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to get consumer profile');
    }
  }
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  async updateConsumerProfile(
    @Body() updateConsumerDto: CreateConsumerDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      return await this.consumerService.updateConsumer(
        userId,
        updateConsumerDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to update consumer profile');
    }
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteConsumerProfile(@Req() req) {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      return await this.consumerService.deleteConsumer(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to delete consumer profile');
    }
  }
}
