import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consumer } from 'src/schemas/consumer.schema';
import { CreateConsumerDto } from 'src/dto/consumer.dto';
import { City } from 'src/schemas/city.schema';
import { State } from 'src/schemas/state.schema';
import { Country } from 'src/schemas/country.schema';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class ConsumerService {
  constructor(
    @InjectModel(Consumer.name) private consumerModel: Model<Consumer>,
    @InjectModel(City.name) private cityModel: Model<City>,
    @InjectModel(State.name) private stateModel: Model<State>,
    @InjectModel(Country.name) private countryModel: Model<Country>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(
    createConsumerDto: CreateConsumerDto,
    userId: string,
  ): Promise<Consumer> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
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
    consumer.user = user;

    return consumer.save();
  }
  async getAllConsumers(): Promise<Consumer[]> {
    return this.consumerModel.find().populate('user').exec();
  }
  async getConsumerById(id: string): Promise<Consumer> {
    const consumer = await this.consumerModel
      .findById(id)
      .populate('user')
      .exec();

    if (!consumer) {
      throw new NotFoundException('Consumer not found');
    }

    return consumer;
  }
  //update Consumer
  async updateConsumer(
    id: string,
    updateConsumerDto: CreateConsumerDto,
  ): Promise<Consumer> {
    const existingConsumer = await this.consumerModel
      .findById(id)
      .populate('user')
      .exec();

    if (!existingConsumer) {
      throw new NotFoundException('Consumer not found');
    }

    // Update only the fields that are present in the request body
    if (updateConsumerDto.phoneNo) {
      existingConsumer.phoneNo = updateConsumerDto.phoneNo;
    }

    if (updateConsumerDto.address) {
      existingConsumer.address = updateConsumerDto.address;
    }

    if (updateConsumerDto.image) {
      existingConsumer.image = updateConsumerDto.image;
    }

    // Update city, state, country if present in the request body
    if (updateConsumerDto.city) {
      const city = await this.cityModel.findOne({
        cityName: updateConsumerDto.city,
      });
      if (!city) {
        throw new Error('Invalid city');
      }
      existingConsumer.city = city;
    }

    if (updateConsumerDto.state) {
      const state = await this.stateModel.findOne({
        stateName: updateConsumerDto.state,
      });
      if (!state) {
        throw new Error('Invalid state');
      }
      existingConsumer.state = state;
    }

    if (updateConsumerDto.country) {
      const country = await this.countryModel.findOne({
        countryName: updateConsumerDto.country,
      });
      if (!country) {
        throw new Error('Invalid country');
      }
      existingConsumer.country = country;
    }

    // Save the updated consumer
    return existingConsumer.save();
  }

  async deleteConsumer(id: string): Promise<{ message: string }> {
    const existingConsumer = await this.consumerModel
      .findById(id)
      .populate('user')
      .exec();

    if (!existingConsumer) {
      throw new NotFoundException('Consumer not found');
    }

    await this.consumerModel.deleteOne({ _id: id });

    return { message: 'Consumer has been deleted' };
  }
}
