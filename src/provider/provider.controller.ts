// provider.controller.ts
import { Controller, Post, Get, Put, Delete, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto, UpdateProviderDto } from 'src/dto/provider.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
// import { Provider } from 'src/schemas/provider.schema';
import { createSuccessResponse, createErrorResponse, PROVIDER_CREATE_SUCCESS, PROVIDER_UPDATE_SUCCESS, PROVIDER_GET_ID_SUCCESS, PROVIDER_GET_All_SUCCESS, PROVIDER_DELETED_SUCCESS, SuccessMessage, ErrorMessage } from 'src/utils/responseUtils';
import { Error } from 'mongoose';

@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) { }

  @Post('/create_provider')
  @UseGuards(JwtAuthGuard)

  async createProvider(@Body() createProviderDto: CreateProviderDto, @Request() req: any): Promise<{ message: any, provider: any }> {
    try {
      // Check if the user has the userType "provider"
      if (req.user && req.user.userType === 'provider') {
        const userId = req.user.userId; // Extract userId from the JWT token
        const createdProvider = await this.providerService.createProvider(createProviderDto, userId);
        console.log('createdProvider:', createdProvider);

        return { message: SuccessMessage.providerCreatedSuccessfully, provider: createdProvider };

      } else {
        throw new HttpException(ErrorMessage.providerUserType, HttpStatus.BAD_REQUEST)
      }
    } catch (error) {
      throw new HttpException(ErrorMessage.genericError, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/getall')

  async getAllProviders(): Promise<{ message: any, provider: any }> {

    const getAllProviders = await this.providerService.getAllProviders();

    return { message: SuccessMessage.getAllProviders, provider: getAllProviders };
  }

  @Get('/get/:id')

  @UseGuards(JwtAuthGuard)

  async getProviderById(@Request() req: any): Promise<{ message: any, provider: any }> {

    try {
      const userId = req.user.userId; // Extract userId from the JWT token

      const userType = await this.providerService.getUserType(userId);

      // Check if the user has the userType "provider"
      if (userType === 'provider') {

        const isProvider = await this.providerService.getProviderByUserId(userId);

        if (!isProvider) {

          return { message: ErrorMessage.providerNotFound, provider: HttpStatus.NOT_FOUND || null };

        }

        return { message: SuccessMessage.getProvidersById, provider: isProvider };

      } else {

        return { message: ErrorMessage.providerUserType, provider: HttpStatus.BAD_REQUEST || null };

      }

    } catch (error) {

      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)

  async updateProvider(@Body() updateProviderDto: UpdateProviderDto, @Request() req: any,): Promise<{ message: any, provider: any }> {

    try {

      const userId = req.user.userId; // Extract userId from the JWT token

      const userType = await this.providerService.getUserType(userId);

      // Check if the user has the userType "provider"
      if (userType === 'provider') {

        const updatedProvider = await this.providerService.updateProvider(updateProviderDto, userId);

        return { message: SuccessMessage.updateProvider, provider: updatedProvider };

      } else {
        return { message: ErrorMessage.providerUserType, provider: HttpStatus.BAD_REQUEST || null };
      }
    } catch (error) {
      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)

  async deleteProvider(@Request() req: any): Promise<{ message: any, provider: any }> {

    try {
      const userId = req.user.userId; // Extract userId from the JWT token

      const deletedProvider = await this.providerService.deleteProvider(userId);

      return {
        message: SuccessMessage.deleteProvider, provider: deletedProvider
      }
    } catch (error) {

      throw new HttpException(error.message || ErrorMessage.genericError, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }
}
