// provider.controller.ts
import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto, UpdateProviderDto } from 'src/dto/provider.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard'; 

@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProvider(@Body() createProviderDto: CreateProviderDto) {
    try {
      const createdProvider = await this.providerService.createProvider(createProviderDto);

      return {
        success: true,
        data: createdProvider,
        message: 'Provider created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create provider',
        error: error.message,
      };
    }
  }

  @Get()
  async getAllProviders() {
    const providers = await this.providerService.getAllProviders();
    return {
      success: true,
      data: providers,
      message: 'Providers retrieved successfully',
    };
  }

  @Get(':id')
  async getProviderById(@Param('id') id: string) {
    const provider = await this.providerService.getProviderById(id);

    if (!provider) {
      return {
        success: false,
        message: 'Provider not found',
      };
    }

    return {
      success: true,
      data: provider,
      message: 'Provider retrieved successfully',
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProvider(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    try {
      const updatedProvider = await this.providerService.updateProvider(id, updateProviderDto);

      return {
        success: true,
        data: updatedProvider,
        message: 'Provider updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update provider',
        error: error.message,
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProvider(@Param('id') id: string) {
    try {
      const deletedProvider = await this.providerService.deleteProvider(id);

      return {
        success: true,
        data: deletedProvider,
        message: 'Provider deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete provider',
        error: error.message,
      };
    }
  }
}
