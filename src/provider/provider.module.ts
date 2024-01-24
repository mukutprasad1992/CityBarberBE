// provider.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { City, CitySchema } from 'src/schemas/city.schema'; // Import City and its schema
import { State, StateSchema } from 'src/schemas/state.schema'; // Import State and its schema
import { Country, CountrySchema } from 'src/schemas/country.schema'; // Import Country and its schema
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
      { name: City.name, schema: CitySchema }, // Add City model and schema
      { name: State.name, schema: StateSchema }, // Add State model and schema
      { name: Country.name, schema: CountrySchema }, // Add Country model and schema
    ]),
    AuthModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
