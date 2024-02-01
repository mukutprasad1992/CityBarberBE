import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSlotDto, UpdateSlotDto } from 'src/dto/slot.dto';
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
    const { openingTime, closingTime } = shop;

    // Check if slots can be created within shop's opening and closing times
    const openingHour = parseInt(openingTime.split(':')[0]);
    const closingHour = parseInt(closingTime.split(':')[0]);

    for (const timing of slotTiming) {
      const [startHour] = timing.split('-')[0].split(':').map(Number);

      // Check if slot timing is before the opening time or after the closing time
      if (startHour < openingHour || startHour >= closingHour) {
        throw new ConflictException(
          'Slot timing is outside shop opening hours',
        );
      }
    }

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
  async getAllSlots(): Promise<{ success: true; slots: Slot[] }> {
    try {
      const slots = await this.slotModel.find().exec();
      return { success: true, slots };
    } catch (error) {
      console.error('Error fetching slots:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getSlotById(id: string): Promise<Slot | null> {
    try {
      const slot = await this.slotModel.findById(id).exec();
      return slot;
    } catch (error) {
      console.error('Error fetching slot by ID:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateSlotById(
    id: string,
    updateSlotDto: UpdateSlotDto,
  ): Promise<Slot> {
    const { ...updateData } = updateSlotDto;

    try {
      const existingSlot = await this.slotModel.findById(id).exec();

      if (!existingSlot) {
        throw new NotFoundException('Slot not found');
      }

      // Check if the provided service ID exists
      if (updateData.serviceId) {
        const serviceExists = await this.serviceModel.exists({
          _id: updateData.serviceId,
        });
        if (!serviceExists) {
          throw new NotFoundException('Service not found');
        }
      }

      // Check for overlapping slots
      if (updateData.slotTiming) {
        const { serviceId, day, date, slotTiming } = updateData;

        const existingSlots = await this.slotModel.find({
          service: serviceId,
          day,
          date,
        });

        for (const existingSlot of existingSlots) {
          for (const existingTiming of existingSlot.slotTiming) {
            for (const newTiming of slotTiming) {
              const [existingStart, existingEnd] = existingTiming
                .split('-')
                .map((time) => new Date(`1970-01-01T${time}:00Z`).getTime());
              const [newStart, newEnd] = newTiming
                .split('-')
                .map((time) => new Date(`1970-01-01T${time}:00Z`).getTime());

              if (!(newEnd <= existingStart || newStart >= existingEnd)) {
                throw new ConflictException(
                  'Slot timing overlaps with existing slots',
                );
              }
            }
          }
        }

        // Retrieve service based on serviceId to get shop details
        const service = await this.serviceModel
          .findById(serviceId)
          .populate('shop')
          .exec();

        if (!service) {
          throw new NotFoundException('Service not found');
        }

        const { shop } = service;
        const { openingTime, closingTime } = shop;

        // Check if slots can be created within shop's opening and closing times
        const openingHour = parseInt(openingTime.split(':')[0]);
        const closingHour = parseInt(closingTime.split(':')[0]);

        for (const timing of slotTiming) {
          const [startHour] = timing.split('-')[0].split(':').map(Number);

          // Check if slot timing is before the opening time or after the closing time
          if (startHour < openingHour || startHour >= closingHour) {
            throw new ConflictException(
              'Slot timing is outside shop opening hours',
            );
          }
        }
      }

      // Update slot fields
      Object.assign(existingSlot, updateData);

      // Save the updated slot
      const updatedSlot = await existingSlot.save();
      return updatedSlot;
    } catch (error) {
      console.error('Error updating slot:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async deleteSlotById(id: string): Promise<void> {
    const deletedSlot = await this.slotModel.findByIdAndDelete(id).exec();
    if (!deletedSlot) {
      throw new HttpException('Slot not found', HttpStatus.NOT_FOUND);
    }
  }
}
