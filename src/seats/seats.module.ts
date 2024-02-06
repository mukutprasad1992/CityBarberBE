// seat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';
import { Seat, SeatSchema } from '../schemas/seat.schema';
import { Provider, ProviderSchema } from '../schemas/provider.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthService } from 'src/auth/service/auth.service'; // Import AuthService
import { JwtAuthGuard } from '../auth/controller/jwt-auth.guard';
import { ShopModule } from 'src/shop/shop.module';
import { ShopSchema, Shop } from 'src/schemas/shop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Seat.name, schema: SeatSchema },
      { name: Provider.name, schema: ProviderSchema },
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
    ]),
    ShopModule,
  ],
  controllers: [SeatsController],
  providers: [SeatsService, JwtAuthGuard, AuthService],
})
export class SeatsModule {}
