// // slot-booking.service.ts

// import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { SlotBooking } from 'src/schemas/slot-booking.schema';
// import { CreateSlotBookingDto, UpdateSlotBookingDto } from 'src/dto/slot-booking.dto';
// import { SlotService } from 'src/slot/slot.service';


// @Injectable()
// export class SlotBookingService {
//   constructor(
//     @InjectModel(SlotBooking.name) private readonly slotBookingModel: Model<SlotBooking>,
//     private readonly slotService: SlotService,
//     ) {}


//   async createSlotBookingWithAvailabilityCheck(
//     createSlotBookingDto: CreateSlotBookingDto,
//     userId: string,
//   ): Promise<SlotBooking> {
//     const { service, slot, date } = createSlotBookingDto;
  
//     // Check if the service is available on the specified date
//     const isServiceAvailable = await this.checkServiceAvailability(service, date);
  
//     if (!isServiceAvailable) {
//       throw new HttpException('Service is not available on the specified date.', HttpStatus.BAD_REQUEST);
//     }
  
//     // Check if the slot is available on the specified date
//     const isSlotAvailable = await this.checkSlotAvailability(slot, date);
  
//     if (!isSlotAvailable) {
//       throw new HttpException('Slot is not available on the specified date.', HttpStatus.BAD_REQUEST);
//     }
  
//     // Create the slot booking
//     const slotBooking = new this.slotBookingModel({
//       ...createSlotBookingDto,
//       user: userId,
//     });
  
//     // Save the slot booking
//     const savedSlotBooking = await slotBooking.save();
  
//     return savedSlotBooking;
//   }
  
//   async checkSlotAvailability(slotId: string, date: string): Promise<boolean> {
//     // Check if the slot is available on the specified date
//     const slot = await this.slotService.getSlotByIdAndDate(slotId, date);

//     return !!slot;
//   }
//   // Add the following method to check if the specified date is available
//   async checkDateAvailability(date: string): Promise<boolean> {
//     // Implement the logic to check if the date is present in the database
//     // You may query your database for available dates and return true if the specified date is found
//     // Otherwise, return false
//     const isDateAvailable = await this.slotBookingModel.findOne({ date }).exec();
//     return !isDateAvailable;
//   }

//   // Add the following method to check if the service is available on the specified date
//   async checkServiceAvailability(serviceId: string, date: string): Promise<boolean> {
//     // Implement the logic to check if the service is available on the specified date
//     // You may query your database for available services on the specified date
//     // Return true if the service is available, otherwise, return false
//     // You can customize this logic based on your data model and business rules
//     const isServiceAvailable = await this.slotBookingModel.findOne({ service: serviceId, date }).exec();
//     return !isServiceAvailable;
//   }


//   async getAllSlotBookings() {
//     return await this.slotBookingModel.find().exec();
//   }

//   async getSlotBookingById(id: string): Promise<SlotBooking> {
//     const slotBooking = await this.slotBookingModel.findById(id).exec();
//     if (!slotBooking) {
//       throw new NotFoundException('Slot booking not found');
//     }
//     return slotBooking;
//   }

//   async updateSlotBookingById(id: string, updateSlotBookingDto: UpdateSlotBookingDto): Promise<SlotBooking> {
//     const slotBooking = await this.slotBookingModel.findByIdAndUpdate(id, updateSlotBookingDto, { new: true }).exec();
//     if (!slotBooking) {
//       throw new NotFoundException('Slot booking not found');
//     }
//     return slotBooking;
//   }

//   async deleteSlotBookingById(id: string): Promise<void> {
//     const slotBooking = await this.slotBookingModel.findByIdAndDelete(id).exec();
//     if (!slotBooking) {
//       throw new NotFoundException('Slot booking not found');
//     }
//   }
// }
