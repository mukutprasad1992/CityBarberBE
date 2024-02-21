import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateCountryDto, UpdateCountryDto } from 'src/dto/country.dto';
import { CountryService } from './country.service';
import { ErrorMessage, SuccessMessage } from 'src/utils/responseUtils';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  // Endpoint to create a new country
  @Post('/create_country')

  async createCountry(@Body() createCountryDto: CreateCountryDto): Promise<{ message: any, country: any }> {

    try {

      const createCountry = await this.countryService.createCountry(createCountryDto);

      return { message: SuccessMessage.countryAddedSuccessfully, country: createCountry };

    } catch (error) {

      // Handle errors if any
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }

  // Endpoint to get all countries
  @Get('/getall')

  async findAllCountry(): Promise<{ message: any, country: any }> {

    try {

      const findAllCountry = await this.countryService.findAllCountry();

      return { message: SuccessMessage.getAllCountries, country: findAllCountry };

    } catch (error) {

      // Handle errors if any
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }

  // Endpoint to get a country by ID
  @Get('/get/:id')

  async findCountryById(@Param('id') id: string): Promise<{ message: any, country: any }> {

    try {

      const findCountryById = await this.countryService.findCountryById(id);

      return { message: SuccessMessage.getCountryById, country: findCountryById };

    } catch (error) {

      // Handle errors if any
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }

  // Endpoint to update a country by ID
  @Put(':id')

  async updateCountry(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto): Promise<{ message: any, country: any }> {

    try {

      const updateCountry = await this.countryService.updateCountry(id, updateCountryDto);

      return { message: SuccessMessage.updateCountry, country: updateCountry };

    } catch (error) {

      // Handle errors if any
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);

    }
  }

  // Endpoint to delete a country by ID
  @Delete(':id')

  async deleteCountry(@Param('id') id: string): Promise<{ message: any, country: any }> {

    try {

      const deleteCountry = await this.countryService.deleteCountry(id);

      return { message: SuccessMessage.deleteCountry, country: deleteCountry };

    } catch (error) {

      // Handle errors if any
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.BAD_REQUEST);
      
    }
  }
}
