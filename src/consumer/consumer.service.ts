import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consumer } from 'src/schemas/consumer.schema';
import { CreateConsumerDto } from 'src/dto/consumer.dto';
import { City } from 'src/schemas/city.schema';
import { State } from 'src/schemas/state.schema';
import { Country } from 'src/schemas/country.schema';
@Injectable()
export class ConsumerService {
  constructor(
    @InjectModel(Consumer.name) private consumerModel: Model<Consumer>,
    @InjectModel(City.name) private cityModel: Model<City>,
    @InjectModel(State.name) private stateModel: Model<State>,
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}
  async create(createConsumerDto: CreateConsumerDto): Promise<Consumer> {
    // Validate and get the city, state, and country
    const city = await this.cityModel.findOne({
      cityName: createConsumerDto.city,
    });
    const state = await this.stateModel.findOne({
      stateName: createConsumerDto.state,
    });
    const country = await this.countryModel.findOne({
      countryName: createConsumerDto.country,
    });

    if (!city || !state || !country) {
      throw new Error('Invalid city, state, or country');
    }

    // Save consumer information to the database
    const consumer = new this.consumerModel(createConsumerDto);
    consumer.city = city;
    consumer.state = state;
    consumer.country = country;

    return consumer.save();
  }
}
