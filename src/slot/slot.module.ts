// // slot.module.ts
// import { Module } from '@nestjs/common';
// import { SlotController } from './slot.controller';
// import { SlotService } from './slot.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Slot, SlotSchema } from 'src/schemas/slot.schema';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }]),
//     JwtModule.register({
//       secret: process.env.JWT_SECRET, // Replace with your actual secret key
//     }),
//   ],
//   controllers: [SlotController],
//   providers: [SlotService, JwtAuthGuard],
// })
// export class SlotModule {}
