import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSlotDto } from 'src/dto/slot.dto';
import { Service } from 'src/schemas/services.schema';
import { Shop } from 'src/schemas/shop.schema';
import { Slot } from 'src/schemas/slot.schema';

@Injectable()
export class SlotService {
  constructor(
    @InjectModel(Slot.name) private readonly slotModel: Model<Slot>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
  ) {}
  async createSlot(createSlotDto: CreateSlotDto) {
    const { serviceId, day, date, slotTiming } = createSlotDto;

    // Check if slots already exist for the given service, day, and date
    const existingSlots = await this.slotModel.find({
      service: serviceId,
      day,
      date,
    });

    // Check if there's any overlap with existing slots
    for (const existingSlot of existingSlots) {
      for (const existingTiming of existingSlot.slotTiming) {
        for (const newTiming of slotTiming) {
          const [existingStart, existingEnd] = existingTiming
            .split('-')
            .map((time) => new Date(`1970-01-01T${time}:00Z`).getTime());
          const [newStart, newEnd] = newTiming
            .split('-')
            .map((time) => new Date(`1970-01-01T${time}:00Z`).getTime());
          // Check if there's any overlap between the timings
          if (!(newEnd <= existingStart || newStart >= existingEnd)) {
            throw new ConflictException(
              'Slot timing overlaps with existing slots',
            );
          }
        }
      }
    }

    // Retrieve service based on serviceId
    const service = await this.serviceModel
      .findById(serviceId)
      .populate('shop')
      .exec();

    // Check if service exists
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Extract shopId, providerId, userId from the retrieved service
    const { shop, provider, user } = service;

    // Extract shopId from shop object
    const shopId = shop._id;

    // Create slots
    const createdSlots = await this.slotModel.create({
      service: serviceId,
      shop: shopId,
      provider,
      user,
      day,
      date,
      slotTiming,
    });

    return [createdSlots];
  }
}
