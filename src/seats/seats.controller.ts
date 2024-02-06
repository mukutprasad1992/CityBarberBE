// seat.controller.ts
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  Res,
  Get,
  Put,
  Delete,
  HttpException,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { JwtAuthGuard } from '../auth/controller/jwt-auth.guard';
import { CreateSeatDto } from 'src/dto/seat.dto';
import { UpdateSeatDto } from 'src/dto/seat.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatService: SeatsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createSeat(
    @Body() createSeatDto: CreateSeatDto,
    @Request() req: any,
    @Res() res: any,
  ) {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'provider') {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User does not have the required userType for seat creation',
      });
    }

    // Check if shopId is provided
    if (!createSeatDto.shopId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Shop ID is required for seat creation',
      });
    }

    try {
      const createdSeats = await this.seatService.createSeat(
        createSeatDto,
        userId,
      );
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Seats created successfully',
        data: createdSeats,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create seats',
        error: error.message,
      });
    }
  }
  @Get('all')
  async getAllSeats(@Res() res) {
    try {
      const seats = await this.seatService.getAllSeats();
      res.status(HttpStatus.OK).json({ success: true, seats });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          success: false,
          message: error.message,
        });
      } else {
        console.error('Unhandled error in getAllSeats:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }
  @Get('id')
  @UseGuards(JwtAuthGuard)
  async getSeatById(@Body() requestBody: { id: string }, @Res() res) {
    const { id } = requestBody;

    try {
      const seat = await this.seatService.getSeatById(id);
      if (!seat) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'seat not found',
        });
      }
      res.status(HttpStatus.OK).json({ success: true, seat });
    } catch (error) {
      console.error('Error in getseatById:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateServiceById(
    @Body() requestBody: { id: string; updateseatDto: UpdateSeatDto },
    @Res() res,
  ) {
    const { id, updateseatDto } = requestBody;

    try {
      if (!id || !updateseatDto) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid request body',
        });
      }

      const updatedseat = await this.seatService.updateseatById(
        id,
        updateseatDto,
      );

      if (!updatedseat) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'seat not found',
        });
      }

      res.status(HttpStatus.OK).json({ success: true, updatedseat });
    } catch (error) {
      console.error('Error updating seat:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteSeatById(@Body() requestBody: { id: string }) {
    try {
      const { id } = requestBody;
      if (!id) {
        throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
      }
      await this.seatService.deleteSeatById(id);
      return { success: true, message: 'Service deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
