// seat.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seat } from 'src/schemas/seat.schema';
import { CreateSeatDto } from 'src/dto/seat.dto';
import { User } from '../schemas/user.schema';
import { Provider } from '../schemas/provider.schema';
import { Shop } from 'src/schemas/shop.schema';
import { UpdateSeatDto } from 'src/dto/seat.dto';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat.name) private seatModel: Model<Seat>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
  ) {}

  async createSeat(
    createSeatDto: CreateSeatDto,
    userId: string,
  ): Promise<Seat[]> {
    const provider = await this.providerModel.findOne({ user: userId }).exec();

    if (!provider) {
      throw new Error('Provider not found');
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }
    const shopExists = await this.shopModel.exists({
      _id: createSeatDto.shopId,
    });
    if (!shopExists) {
      throw new NotFoundException('Shop not found');
    }

    const seats = [];

    for (const seatName of createSeatDto.seatName) {
      const createdSeat = new this.seatModel({
        ...createSeatDto,
        provider: provider._id,
        user: user._id,
        seatName: [seatName],
      });
      seats.push(await createdSeat.save());
    }

    return seats;
  }
  async getAllSeats(): Promise<{ success: true; seats: Seat[] }> {
    try {
      const seats = await this.seatModel.find().exec();
      return { success: true, seats };
    } catch (error) {
      console.error('Error fetching Seats:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getSeatById(id: string): Promise<Seat | null> {
    try {
      const seat = await this.seatModel.findById(id).exec();
      return seat;
    } catch (error) {
      console.error('Error fetching slot by ID:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateseatById(
    id: string,
    updateSeatDto: UpdateSeatDto,
  ): Promise<Seat> {
    try {
      // Find the existing seat by ID
      const existingSeat = await this.seatModel.findById(id).exec();
      if (!existingSeat) {
        throw new HttpException('seat not found', HttpStatus.NOT_FOUND);
      }

      // Update only the specified fields
      if (updateSeatDto.seatName) {
        existingSeat.seatName = updateSeatDto.seatName;
      }
      // Add similar checks for other fields

      // Save the updated seat
      const updatedSeat = await existingSeat.save();
      return updatedSeat;
    } catch (error) {
      console.error('Error updating seat:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async deleteSeatById(id: string): Promise<void> {
    const deletedSeat = await this.seatModel.findByIdAndDelete(id).exec();
    if (!deletedSeat) {
      throw new HttpException('Seat not found', HttpStatus.NOT_FOUND);
    }
  }
}
