   // modules/shop/shop.module.ts

   // ... (existing imports)

   import { Service, ServiceSchema } from 'src/schemas/services.schema';
   import { ServiceService } from 'src/services/services.service'; // Import the new ServiceService
   import { ServiceController } from 'src/services/services.controller'; // Import the new ServiceController
   import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
   import { AuthService } from 'src/auth/service/auth.service';
   import { User, UserSchema } from 'src/schemas/user.schema';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { Shop, ShopSchema } from 'src/schemas/shop.schema';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

   @Module({
     imports: [
       MongooseModule.forFeature([
         { name: Shop.name, schema: ShopSchema },
         { name: Provider.name, schema: ProviderSchema },
         { name: User.name, schema: UserSchema },
         { name: Service.name, schema: ServiceSchema }, // Include the Service schema
       ]),
       JwtModule.register({
         secret: process.env.JWT_SECRET,
       }),
     ],
     controllers: [ShopController, ServiceController], // Include the new ServiceController
     providers: [ShopService, ServiceService, JwtAuthGuard, AuthService], // Include the new ServiceService
   })
   export class ShopModule {}
