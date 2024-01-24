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
    const userId = req.user.user ||req.user.userId ;
    const userType = req.user.userType;
    console.log("userId:", req.user.user)

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
      return {
        success: true,
        message: 'Consumer created successfully',
        consumer,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to create consumer');
    }
  }
  @Get('all')
  async getAllConsumers() {
    const consumers = await this.consumerService.getAllConsumers();
    return { success: true, consumers };
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
      const consumer = await this.consumerService.getConsumerById(userId);
      return { success: true, consumer };
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
      const updatedConsumer = await this.consumerService.updateConsumer(
        userId,
        updateConsumerDto,
      );
      return { success: true, consumer: updatedConsumer };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to update consumer profile');
    }
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteConsumerProfile(
    @Req() req,
  ): Promise<{ success: true; message: string }> {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'consumer') {
      throw new NotFoundException(
        'User does not have the required userType of consumer',
      );
    }

    try {
      await this.consumerService.deleteConsumer(userId);
      return { success: true, message: 'Consumer has been deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('Failed to delete consumer profile');
    }
  }
}
