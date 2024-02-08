// // slot-booking.controller.ts

// import {
//     Controller,
//     Body,
//     Post,
//     Get,
//     Param,
//     Put,
//     Delete,
//     UseGuards,
//     Req,
//     HttpException,
//     HttpStatus,
//   } from '@nestjs/common';
//   import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
//   import { CreateSlotBookingDto } from 'src/dto/slot-booking.dto';
//   import { SlotBookingService } from './bookslot.service';
  
//   @Controller('slot-booking')
//   export class SlotBookingController {
//     constructor(private readonly slotBookingService: SlotBookingService) {}
  
//     @Post('create')
//     @UseGuards(JwtAuthGuard)
//     async createSlotBooking(
//       @Body() createSlotBookingDto: CreateSlotBookingDto,
//       @Req() req,
//     ) {
//       const userId = req.user.userId;
  
//       try {
//         const slotBooking = await this.slotBookingService.createSlotBookingWithAvailabilityCheck(
//           createSlotBookingDto,
//           userId,
//         );
//         return {
//           success: true,
//           message: 'Slot booking created successfully',
//           slotBooking,
//         };
//       } catch (error) {
//         if (error instanceof HttpException) {
//           throw new HttpException(error.message, error.getStatus());
//         } else {
//           throw new HttpException(
//             'Internal server error',
//             HttpStatus.INTERNAL_SERVER_ERROR,
//           );
//         }
//       }
//     }
  
//     @Get('all')
//     async getAllSlotBookings() {
//       const slotBookings = await this.slotBookingService.getAllSlotBookings();
//       return { success: true, slotBookings };
//     }
  
//     @Get(':id')
//     async getSlotBookingById(@Param('id') id: string) {
//       const slotBooking = await this.slotBookingService.getSlotBookingById(id);
//       return { success: true, slotBooking };
//     }
  
//     @Put('update')
//     @UseGuards(JwtAuthGuard)
//     async updateSlotBookingById(
//       @Body() requestBody: { id: string; updateSlotBookingDto },
//     ) {
//       const { id, updateSlotBookingDto } = requestBody;
//       const updatedSlotBooking = await this.slotBookingService.updateSlotBookingById(
//         id,
//         updateSlotBookingDto,
//       );
//       return { success: true, updatedSlotBooking };
//     }
  
//     @Delete('delete')
//     @UseGuards(JwtAuthGuard)
//     async deleteSlotBookingById(@Body() requestBody: { id: string }) {
//       const { id } = requestBody;
//       await this.slotBookingService.deleteSlotBookingById(id);
//       return { success: true, message: 'Slot booking deleted successfully' };
//     }
//   }
  