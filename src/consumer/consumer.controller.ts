import { Controller, Body, Post } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateConsumerDto } from 'src/dto/consumer.dto';
import { Consumer } from 'src/schemas/consumer.schema';
@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post()
  async create(
    @Body() createConsumerDto: CreateConsumerDto,
  ): Promise<Consumer> {
    return this.consumerService.create(createConsumerDto);
  }
}
