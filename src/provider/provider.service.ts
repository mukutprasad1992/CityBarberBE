// provider.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto, UpdateProviderDto } from 'src/dto/provider.dto';
import { Provider } from 'src/schemas/provider.schema';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<Provider>,
  ) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<Provider> {
    const createdProvider = new this.providerModel(createProviderDto);
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
