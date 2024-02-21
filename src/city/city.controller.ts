import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateCityDto, UpdateCityDto } from 'src/dto/city.dto';
import { CityService } from './city.service';
import { ErrorMessage, SuccessMessage } from 'src/utils/responseUtils';

@Controller('city')
export class CityController {

  constructor(private readonly cityService: CityService) { }

  // Endpoint to create a new city
  @Post('/create_city')

  async createCity(@Body() createCityDto: CreateCityDto): Promise<{ message: any, city: any }> {

    try {

      // Call the city service to create a new city
      const createCity = await this.cityService.createCity(createCityDto);

      return { message: SuccessMessage.cityAddedSuccessfully, city: createCity };

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      throw new HttpException(error.message || ErrorMessage.cityNotFound, HttpStatus.NOT_FOUND);

    }
  }

  // Endpoint to retrieve all cities
  @Get('/getall')

  async findAllCities(): Promise<{ message: any, city: any }> {

    try {

      // Call the city service to find all cities
      const findAllCities = await this.cityService.findAllCity();

      return { message: SuccessMessage.getAllCity, city: findAllCities };

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }

  // Endpoint to find a city by ID
  @Get('/get/:id')

  async findCityById(@Param('id') id: string): Promise<{ message: any, city: any }> {

    try {

      // Call the city service to find a city by ID
      const findCityById = await this.cityService.findCityById(id);

      return { message: SuccessMessage.getCityById, city: findCityById };

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }

  // Endpoint to update a city by ID
  @Put('/update/:id')

  async updateCity(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto): Promise<{ message: any, city: any }> {

    try {

      // Call the city service to update a city by ID
      const updateCity = await this.cityService.updateCity(id, updateCityDto);

      return { message: SuccessMessage.updateCity, city: updateCity };

    } catch (error) {
      // Handle errors and throw appropriate HTTP exceptions

      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }

  // Endpoint to delete a city by ID
  @Delete('/delete/:id')

  async deleteCity(@Param('id') id: string): Promise<{ message: any, city: any }> {

    try {

      // Call the city service to delete a city by ID
      const deleteCity = this.cityService.deleteCity(id);

      return { message: SuccessMessage.deleteCity, city: deleteCity };

    } catch (error) {

      // Handle errors and throw appropriate HTTP exceptions
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }
}
