import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from 'src/schemas/city.schema';
import { CreateCityDto, UpdateCityDto } from 'src/dto/city.dto';
import { ErrorMessage } from 'src/utils/responseUtils';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) { }

  // Method to create a new city
  async createCity(createCityDto: CreateCityDto): Promise<City> {

    try {
      // Create a new city instance with the provided data
      const createdCity = new this.cityModel(createCityDto);
      // Save the created city to the database
      return createdCity.save();

    } catch (error) {

      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)

    }

  }

  // Method to retrieve all cities
  async findAllCity(): Promise<City[]> {
    try {
      // Retrieve all cities from the database
      const findAllCity = this.cityModel.find().exec();

      return findAllCity

    } catch (error) {

      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)

    }

  }

  // Method to find a city by ID
  async findCityById(id: string): Promise<City> {

    try {
      
      // Find a city by its ID in the database
      return this.cityModel.findById(id).exec();

    } catch (error) {
      
    }
   
  }

  // Method to update a city by ID
  async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    // Find and update the city by its ID with the provided data
    return this.cityModel.findByIdAndUpdate(id, updateCityDto, { new: true }).exec();
  }

  // Method to delete a city by ID
  async deleteCity(id: string): Promise<{ message: string }> {

    // Find and delete the city by its ID

    const existingCity = await this.cityModel.findByIdAndDelete(id);

    // If the city does not exist, throw NotFoundException
    if (!existingCity) {
      throw new NotFoundException('City not found');
    }

    // Return success message if the city is deleted successfully
    return { message: 'City has been deleted' };
  }
}
