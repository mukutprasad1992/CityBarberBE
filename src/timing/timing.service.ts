// timing.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timing } from 'src/schemas/timing.schema';
import { CreateTimingDto, UpdateTimingDto } from 'src/dto/timing.dto';
import { Shop } from 'src/schemas/shop.schema';

@Injectable()
export class TimingService {
  constructor(
    @InjectModel(Timing.name) private timingModel: Model<Timing>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
  ) {}

  async createTiming(createTimingDto: CreateTimingDto, userId: string) {
    const { shop } = createTimingDto;

    // Check if the shop ID is valid
    const existingShop = await this.shopModel.findById(shop).exec();
    if (!existingShop) {
      throw new Error('Shop not found');
    }

    // Retrieve the shop details to get the opening and closing time
    const shopDetails = await this.shopModel
      .findById(shop)
      .select('openingTime closingTime')
      .exec();

    if (!shopDetails) {
      throw new Error('Shop not found');
    }

    const openingTime = shopDetails.openingTime.toString(); // Convert to string
    const closingTime = shopDetails.closingTime.toString(); // Convert to string

    // Generate date-time slots between opening and closing time
    const dateTimeSlots = generateTimeSlots(openingTime, closingTime);

    // Create timings based on the generated date-time slots
    const createdTimings = await Promise.all(
      dateTimeSlots.map((dateTime) =>
        this.timingModel.create({
          shop: shop.toString(), // Ensure shop is stored as a string
          time: dateTime,
          user: userId,
        }),
      ),
    );

    if (createdTimings.length === 0) {
      throw new Error('No timings created');
    }

    return {
      success: true,
      message: 'Timings created successfully',
      data: createdTimings,
    };
  }

  async getTimingById(id: string): Promise<Timing | null> {
    try {
      const timing = await this.timingModel.findById(id).exec();
      return timing;
    } catch (error) {
      console.error('Error fetching slot by ID:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTimingById(
    id: string,
    updateTimingDto: UpdateTimingDto,
  ): Promise<Timing> {
    const { disabled } = updateTimingDto;
    try {
      // Find the existing timing by ID
      const existingTiming = await this.timingModel.findById(id).exec();
      if (!existingTiming) {
        throw new HttpException('timing not found', HttpStatus.NOT_FOUND);
      }

      // Update only the specified fields
      if (disabled !== undefined) {
        existingTiming.disabled = disabled;
      }
      // Add similar checks for other fields

      // Save the updated timing
      const updatedTiming = await existingTiming.save();
      return updatedTiming;
    } catch (error) {
      console.error('Error updating timing:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  async deleteTimingById(id: string): Promise<boolean> {
    try {
      const result = await this.timingModel.findByIdAndDelete(id).exec();
      return !!result; // Returns true if the document was deleted, false otherwise
    } catch (error) {
      console.error('Error deleting timing:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async getAllTimings(): Promise<Timing[]> {
    try {
      const timings = await this.timingModel.find().exec();
      return timings;
    } catch (error) {
      console.error('Error getting timings:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

function generateTimeSlots(openingTime: string, closingTime: string): string[] {
  const dateTimeSlots: string[] = [];
  let currentDate = new Date(); // Use the current date as a starting point
  const openingHour = parseInt(openingTime.split(':')[0]);
  const openingMinute = parseInt(openingTime.split(':')[1]);

  currentDate.setHours(openingHour, openingMinute, 0, 0); // Set initial time to opening time

  const closingHour = parseInt(closingTime.split(':')[0]);

  while (
    currentDate.getHours() < closingHour ||
    (currentDate.getHours() === closingHour && currentDate.getMinutes() === 0)
  ) {
    const formattedDateTime = formatDateTime(currentDate);
    dateTimeSlots.push(formattedDateTime);

    // Increment time by 1 hour
    currentDate.setHours(currentDate.getHours() + 1);
  }

  console.log('Generated Time Slots:', dateTimeSlots); // Log the generated date-time slots
  return dateTimeSlots;
}

function formatDateTime(dateTime: Date): string {
  //   const year = dateTime.getFullYear();
  //   const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
  //   const day = dateTime.getDate().toString().padStart(2, '0');
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}
