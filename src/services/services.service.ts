// services/service.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from 'src/schemas/services.schema';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto/services.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
  ) {}

  async createService(
    createServiceDto: CreateServiceDto,
    userId: string,
  ) {
    const { shop, provider, user, ...rest } = createServiceDto;

    const createdService = await this.serviceModel.create({
      ...rest,
      user: userId,
    });

    return createdService;
  }

  async getAllServices() {
    return await this.serviceModel.find().exec();
  }

  async getServiceById(serviceId: string) {
    return await this.serviceModel.findById(serviceId).exec();
  }

  async updateService(
    userId: string,
    serviceId: string,
    updateServiceDto: UpdateServiceDto,
  ) {
    const service = await this.serviceModel
      .findOneAndUpdate({ user: userId, _id: serviceId }, updateServiceDto, {
        new: true,
      })
      .exec();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async deleteService(userId: string, serviceId: string) {
    const service = await this.serviceModel
      .findOneAndDelete({ user: userId, _id: serviceId })
      .exec();

    if (!service) {
      throw new NotFoundException('Service not found');
    }
  }
}
