// // slot-booking.module.ts

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { JwtModule } from '@nestjs/jwt';
// import { SlotBooking, SlotBookingSchema } from 'src/schemas/slot-booking.schema';
// import { SlotBookingService } from './bookslot.service';
// import { SlotBookingController } from './bookslot.controller';
// import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
// import { AuthModule } from 'src/auth/auth.module';
// import { SlotModule } from 'src/slot/slot.module';
// import { SlotService } from 'src/slot/slot.service';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: SlotBooking.name, schema: SlotBookingSchema }]),
//     JwtModule.register({ secret: process.env.JWT_SECRET }),
//     AuthModule,
//     SlotModule
//   ],
//   providers: [SlotBookingService, JwtAuthGuard, SlotService],
//   controllers: [SlotBookingController],
// })
// export class SlotBookingModule {}
