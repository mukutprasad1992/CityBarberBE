// timing.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  Get,
  Put,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { TimingService } from './timing.service';
import { CreateTimingDto, UpdateTimingDto } from 'src/dto/timing.dto';
import {
  createSuccessResponse,
  createErrorResponse,
  TIMING_CREATE_SUCCESS,
  TIMING_UPDATE_SUCCESS,
  TIMING_GET_ID_SUCCESS,
} from 'src/utils/responseUtils';

@Controller('timing')
export class TimingController {
  constructor(private readonly timingService: TimingService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createTiming(
    @Body() createTimingDto: CreateTimingDto,
    @Request() req: any,
    @Res() res: any,
  ) {
    try {
      const createdTimings = await this.timingService.createTiming(
        createTimingDto,
        req.user.userId,
      );

      return res
        .status(HttpStatus.CREATED)
        .json(
          createSuccessResponse(createdTimings,TIMING_CREATE_SUCCESS),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse('Failed to create timings', error.message));
    }
  }

  @Get('id')
  @UseGuards(JwtAuthGuard)
  async getTimingById(@Body() requestBody: { id: string }, @Res() res) {
    const { id } = requestBody;

    try {
      const timing = await this.timingService.getTimingById(id);
      if (!timing) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(createErrorResponse('Timing not found'));
      }
      res
        .status(HttpStatus.OK)
        .json(createSuccessResponse(timing, TIMING_GET_ID_SUCCESS));
    } catch (error) {
      console.error('Error in gettimingById:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse('Internal server error', error.message));
    }
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateTimingById(
    @Body() requestBody: { id: string; updatetimingDto: UpdateTimingDto },
    @Res() res,
  ) {
    const { id, updatetimingDto } = requestBody;

    try {
      if (!id || !updatetimingDto) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid request body',
        });
      }

      const updatedtiming = await this.timingService.updateTimingById(
        id,
        updatetimingDto,
      );

      if (!updatedtiming) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'timing not found',
        });
      }

      res.status(HttpStatus.OK).json(createSuccessResponse(updatedtiming,TIMING_UPDATE_SUCCESS ));
    } catch (error) {
      console.error('Error updating timing:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse('Internal server error', error.message));
    }
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteTimingById(@Body() requestBody: { id: string }, @Res() res) {
    const { id } = requestBody;

    try {
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid request body',
        });
      }

      const isDeleted = await this.timingService.deleteTimingById(id);

      if (!isDeleted) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Timing not found',
        });
      }

      res
        .status(HttpStatus.OK)
        .json(createSuccessResponse(null, 'Timing deleted successfully'));
    } catch (error) {
      console.error('Error deleting timing:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse('Internal server error', error.message));
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllTimings(@Res() res) {
    try {
      const timings = await this.timingService.getAllTimings();

      res.status(HttpStatus.OK).json(createSuccessResponse(timings));
    } catch (error) {
      console.error('Error getting timings:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse('Internal server error', error.message));
    }
  }
}
