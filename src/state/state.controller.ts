import { Controller } from '@nestjs/common';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateStateDto, UpdateStateDto } from 'src/dto/state.dto';
import { StateService } from './state.service';
import { SuccessMessage } from 'src/utils/responseUtils';
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) { }

  @Post('/create_state')
  async createState(@Body() createStateDto: CreateStateDto): Promise<{ message: any, state: any }> {

    const createState = await this.stateService.create(createStateDto);

    return { message: SuccessMessage.stateAddedSuccessfully, state: createState }
  }

  @Get('/getall')
  async findAllState(): Promise<{ message: any, state: any }> {

    const getAllState = await this.stateService.findAll()

    return { message: SuccessMessage.getAllState, state: getAllState }

  }
  @Get('/get/:id')
  async findStateById(@Param('id') id: string): Promise<{ message: any, state: any }> {

    const findStateById = await this.stateService.findById(id);

    return { message: SuccessMessage.getStateById, state: findStateById }

  }

  @Put('/update/:id')
  async updateState(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto): Promise<{ message: any, state: any }> {

    const updateState = await this.stateService.update(id, updateStateDto);

    return { message: SuccessMessage.updateState, state: updateState }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.stateService.deleteById(id);
  }
}
