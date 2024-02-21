import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/schemas/country.schema';
import { CreateCountryDto, UpdateCountryDto } from 'src/dto/country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) { }

  // Method to create a new country
  async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
    const createdCountry = new this.countryModel(createCountryDto);
    return createdCountry.save();
  }

  // Method to fetch all countries
  async findAllCountry(): Promise<Country[]> {
    return this.countryModel.find().exec();
  }

  // Method to find a country by its ID
  async findCountryById(id: string): Promise<Country> {
    return this.countryModel.findById(id).exec();
  }

  // Method to update a country by its ID
  async updateCountry(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    return this.countryModel
      .findByIdAndUpdate(id, updateCountryDto, { new: true })
      .exec();
  }

  // Method to delete a country by its ID
  async deleteCountry(id: string): Promise<{ message: string }> {
    const existingCountry = await this.countryModel.findByIdAndDelete(id);

    if (!existingCountry) {
      throw new NotFoundException('Country not found');
    }

    return { message: 'Country has been deleted' };
  }
}
