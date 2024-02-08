// timing.module.ts
import { Module } from '@nestjs/common';
import { TimingController } from './timing.controller';
import { TimingService } from './timing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Timing, TimingSchema } from 'src/schemas/timing.schema';
import { Shop, ShopSchema } from 'src/schemas/shop.schema';
import { AuthService } from 'src/auth/service/auth.service';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { User,UserSchema } from 'src/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timing.name, schema: TimingSchema },
      { name: Shop.name, schema: ShopSchema }, // Add the Shop model schema
      { name: User.name, schema: UserSchema }, // Add the Shop model schema
    ]),
    
  ],
  controllers: [TimingController],
  providers: [TimingService,AuthService,JwtAuthGuard],
})
export class TimingModule {}
