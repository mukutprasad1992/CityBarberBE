import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  NotFoundException,
  Get,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  //   Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { CreateShopDto, UpdateShopDto } from 'src/dto/shop.dto';
import { ShopService } from './shop.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {  Multer } from 'multer';
import {
  createSuccessResponse,
  createErrorResponse,
  SHOP_CREATE_SUCCESS,
  SHOP_UPDATE_SUCCESS,
  SHOP_GET_ID_SUCCESS,
  SHOP_GET_All_SUCCESS,
  SHOP_DELETED_SUCCESS
} from 'src/utils/responseUtils';


@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image')) // 'image' is the field name for the file in the request
  async createShop(
    @Body() createShopDto: CreateShopDto,
    @Request() req: any,
    @Res() res: any,
    @UploadedFile() file: Multer.File, // Update the type to Multer.File
  ) {
    const userId = req.user.userId;

    const userType = req.user.userType;

    if (userType !== 'provider') {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User does not have the required userType for shop creation',
      });
    }

    try {

       // Check if a file is uploaded
       if (file) {
        // Process the uploaded file, e.g., save its information in the database
        console.log('Uploaded file:', file);
      }

      const createdShop = await this.shopService.createShop(
        createShopDto,
        userId,
      );
      // Include userId in the response data
      const responseData = {
        ...createdShop.toObject(),
      };

      return res.status(HttpStatus.CREATED).json(
        createSuccessResponse(createdShop,SHOP_CREATE_SUCCESS),
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message,
        });
      } else if (
        error.response &&
        error.response.statusCode === HttpStatus.CONFLICT
      ) {
        return res.status(HttpStatus.CONFLICT).json({
          success: false,
          message: 'User already has a shop',
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Failed to create shop',
          error: error.message,
        });
      }
    }
  }
  @Get()
  async getAllShops(@Res() res: any) {
    try {
      const shops = await this.shopService.getAllShops();
      return res.status(HttpStatus.OK).json(
        createSuccessResponse(shops,SHOP_GET_All_SUCCESS),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to retrieve shops',
        error: error.message,
      });
    }
  }

  @Get('getid')
  @UseGuards(JwtAuthGuard)
  async getShopByUserId(@Res() res: any, @Request() req: any) {
    const userId = req.user.userId;

    try {
      const shop = await this.shopService.getShopByUserId(userId);
      return res.status(HttpStatus.OK).json(
        createSuccessResponse(shop,SHOP_GET_ID_SUCCESS),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to retrieve shop',
        error: error.message,
      });
    }
  }
  @Put('/update')
  @UseGuards(JwtAuthGuard)
  async updateShop(
    @Body() updateShopDto: UpdateShopDto,
    @Request() req: any,
    @Res() res: any,
  ) {
    const userId = req.user.userId;

    try {
      const updatedShop = await this.shopService.updateShop(
        userId,
        updateShopDto,
      );
      return res.status(HttpStatus.OK).json(
        createSuccessResponse(updatedShop,SHOP_UPDATE_SUCCESS),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to update shop',
        error: error.message,
      });
    }
  }
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteShop(@Res() res: any, @Request() req: any) {
    const userId = req.user.userId;

    try {
      await this.shopService.deleteShop(userId);
      return res.status(HttpStatus.OK).json(
        createSuccessResponse(SHOP_DELETED_SUCCESS),
      );
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to delete shop',
        error: error.message,
      });
    }
  }
}
