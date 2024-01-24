// provider.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto, UpdateProviderDto } from 'src/dto/provider.dto';
import { City } from 'src/schemas/city.schema';
import { Country } from 'src/schemas/country.schema';
import { Provider } from 'src/schemas/provider.schema';
import { State } from 'src/schemas/state.schema';

@Injectable()
export class ProviderService {
  // cityModel: any;
  // stateModel: any;
  // countryModel: any;
  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<Provider>,
    @InjectModel(City.name) private readonly cityModel: Model<City>,
    @InjectModel(State.name) private readonly stateModel: Model<State>,
    @InjectModel(Country.name) private readonly countryModel: Model<Country>,
  ) {}

  async createProvider(createProviderDto: CreateProviderDto 
    ): Promise<Provider> {
    // Validate and get the city, state, and country
    const city = await this.cityModel.findOne({
      cityName: createProviderDto.city,
    });
    console.log("city:", city)
    const state = await this.stateModel.findOne({
      stateName: createProviderDto.state,
    });
    console.log("state:", state)

    const country = await this.countryModel.findOne({
      countryName: createProviderDto.country,
    });
    console.log("country:",country)


    if (!city || !state || !country) {
      throw new Error('Invalid city, state, or country');
    }

    // Save provider information to the database
    const createdProvider = new this.providerModel(createProviderDto);
    createdProvider.city = city;
    createdProvider.state = state;
    createdProvider.country = country;

    return createdProvider.save();
  }


  async getAllProviders(): Promise<Provider[]> {
    return this.providerModel.find().exec();
  }

  async getProviderById(id: string): Promise<Provider | null> {
    return this.providerModel.findById(id).exec();
  }

  async updateProvider(id: string, updateProviderDto: UpdateProviderDto): Promise<Provider> {
    const existingProvider = await this.providerModel.findById(id).exec();

    if (!existingProvider) {
      throw new NotFoundException('Provider not found');
    }

    // Update fields based on the updateProviderDto
    Object.assign(existingProvider, updateProviderDto);

    return existingProvider.save();
  }

  async deleteProvider(id: string): Promise<Provider | null> {
    const deletedProvider = await this.providerModel.findByIdAndDelete(id).exec();
    
    if (!deletedProvider) {
      throw new NotFoundException('Provider not found');
    }

    return deletedProvider;
  }
}
