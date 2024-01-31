import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { CreateSlotDto } from 'src/dto/slot.dto';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSlot(
    @Body() createSlotDto: CreateSlotDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    // console.log('Received slotDate:', createSlotDto.date);
    const userType = req.user.userType;

    try {
      // Ensure only providers can create slots
      if (userType !== 'provider') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message:
            'User does not have the required userType for creating slots',
        });
      }

      const createdSlots = await this.slotService.createSlot(createSlotDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Slots created successfully',
        data: createdSlots,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create slots',
        error: error.message,
      });
    }
  }
}
