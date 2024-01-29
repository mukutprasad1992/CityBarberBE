// controllers/service.controller.ts

import { Controller, Post, Body, UseGuards, Request, Res, HttpStatus, Get, Param, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { ServiceService } from 'src/services/services.service';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto/services.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createService(
    @Body() createServiceDto: CreateServiceDto,
    @Request() req: any,
    @Res() res: any,
  ) {
    const userId = req.user.userId;

    try {
      const createdService = await this.serviceService.createService(
        createServiceDto,
        userId,
      );

      const responseData = {
        ...createdService.toObject(),
      };

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Service created successfully',
        data: responseData,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create service',
        error: error.message,
      });
    }
  }

  @Get()
  async getAllServices(@Res() res: any) {
    try {
      const services = await this.serviceService.getAllServices();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Services retrieved successfully',
        data: services,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to retrieve services',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async getServiceById(@Res() res: any, @Param('id') id: string) {
    try {
      const service = await this.serviceService.getServiceById(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Service retrieved successfully',
        data: service,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to retrieve service',
        error: error.message,
      });
    }
  }

  @Put(':id/update')
  @UseGuards(JwtAuthGuard)
  async updateService(
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req: any,
    @Res() res: any,
    @Param('id') id: string,
  ) {
    const userId = req.user.userId;

    try {
      const updatedService = await this.serviceService.updateService(
        userId,
        id,
        updateServiceDto,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Service updated successfully',
        data: updatedService,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to update service',
        error: error.message,
      });
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthGuard)
  async deleteService(@Res() res: any, @Request() req: any, @Param('id') id: string) {
    const userId = req.user.userId;

    try {
      await this.serviceService.deleteService(userId, id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to delete service',
        error: error.message,
      });
    }
  }
}
