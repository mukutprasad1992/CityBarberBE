// // slot.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Slot } from 'src/schemas/slot.schema';
// import { CreateSlotDto } from 'src/dto/slot.dto';
// import { ShopService } from 'src/shop/shop.service';
// @Injectable()
// export class SlotService {
//   constructor(
//     @InjectModel(Slot.name) private readonly slotModel: Model<Slot>,
//     private readonly shopService: ShopService, // Inject ShopService
//   ) {}

//   async createSlot(createSlotDto: CreateSlotDto, userId: string) {
//     const shop = await this.shopService.getShopByUserId(userId);

//     if (!shop) {
//       throw new NotFoundException('Shop not found');
//     }

//     // Calculate startTime and endTime based on shop opening and closing time
//     const startTime = new Date(shop.openingTime);
//     const endTime = new Date(shop.closingTime);

//     const createdSlot = await this.slotModel.create({
//       shop: shop._id, // Use the shop ID from the found shop
//       startTime,
//       endTime,
//       // Add other properties from createSlotDto as needed
//     });

//     return createdSlot;
//   }

//   // Add other CRUD operations as needed
// }
