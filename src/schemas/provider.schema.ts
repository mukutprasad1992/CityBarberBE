import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Country, CountrySchema } from './country.schema';
import { State, StateSchema } from './state.schema';
import { City, CitySchema } from './city.schema';
import { User } from './user.schema';

@Schema()
export class Provider extends Document {
  @Prop({ required: true, match: /^\+?[0-9]+$/ })
  primaryPhoneNumber: string;

  @Prop({ match: /^\+?[0-9]*$/ })
  secondaryPhoneNumber?: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, match: /^[0-9]{6}$/ })
  pincode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: City.name })
  city: City;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: State.name })
  state: State;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Country.name })
  country: Country;

  @Prop({ required: true, validate: { validator: (value: string) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value), message: 'Invalid profile image URL.' } })
  profileImage: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
