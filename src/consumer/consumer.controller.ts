import {
  Controller,
  Body,
  Post,
  Param,
  NotFoundException,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto } from 'src/dto/consumer.dto';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post(':userId/create')
  async createConsumer(
    @Param('userId') userId: string,
    @Body() createConsumerDto: CreateConsumerDto,
  ) {
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

  @Get(':id')
  async getConsumerById(@Param('id') id: string) {
    return this.consumerService.getConsumerById(id);
  }
  @Patch(':id/update')
  async updateConsumer(
    @Param('id') id: string,
    @Body() updateConsumerDto: CreateConsumerDto,
  ) {
    return this.consumerService.updateConsumer(id, updateConsumerDto);
  }
  @Delete(':id/delete')
  async deleteConsumer(@Param('id') id: string) {
    return this.consumerService.deleteConsumer(id);
  }
}
