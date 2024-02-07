// // slot.controller.ts
// import { Controller, Post, Body, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
// import { SlotService } from './slot.service';
// import { CreateSlotDto } from 'src/dto/slot.dto';

// @Controller('slot')
// export class SlotController {
//   constructor(private readonly slotService: SlotService) {}

//   @Post('/create')
//   @UseGuards(JwtAuthGuard)
//   async createSlot(@Body() createSlotDto: CreateSlotDto, @Request() req: any, @Res() res: any) {
//     try {
//       const userId = req.user.userId; // Get user ID from the token
//       const createdSlot = await this.slotService.createSlot(createSlotDto, userId);
//       return res.status(HttpStatus.CREATED).json({
//         success: true,
//         message: 'Slot created successfully',
//         data: createdSlot,
//       });
//     } catch (error) {
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: 'Failed to create slot',
//         error: error.message,
//       });
//     }
//   }

//   // Add other CRUD operations as needed
// }
