import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Consumer, ConsumerSchema } from 'src/schemas/consumer.schema';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { City, CitySchema } from 'src/schemas/city.schema';
import { State, StateSchema } from 'src/schemas/state.schema';
import { Country, CountrySchema } from 'src/schemas/country.schema';
// import { UserModule } from 'src/users/user.module';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Consumer.name, schema: ConsumerSchema },
      { name: City.name, schema: CitySchema },
      { name: State.name, schema: StateSchema },
      { name: Country.name, schema: CountrySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ConsumerService],
  controllers: [ConsumerController],
})
export class ConsumerModule {}
