// provider.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto } from 'src/dto/provider.dto';
import { Provider } from 'src/schemas/provider.schema';

@Injectable()
export class ProviderService {
  constructor(@InjectModel(Provider.name) private providerModel: Model<Provider>) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<Provider> {
    // Check if the city exists in the database
    const cityExists = await this.providerModel.findOne({ city: createProviderDto.city }).exec();

    if (!cityExists) {
      throw new NotFoundException('City does not exist');
    }

    // Create the provider
    const provider = await this.providerModel.create(createProviderDto);
    return provider.save();
  }
}
