// Example: provider.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  // Import MongooseModule
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }]),  // Import MongooseModule with the ProviderModel
  AuthModule], 
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
