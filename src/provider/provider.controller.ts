// provider.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from 'src/dto/provider.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Use a guard to ensure the user is logged in
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
}
