// consumer/consumer.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Country } from './country.schema';
import { State } from './state.schema';
import { City } from './city.schema';

@Schema()
export class Consumer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNo: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  image: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: City.name })
  city: City;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: State.name })
  state: State;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Country.name })
  country: Country;
}

export const ConsumerSchema = SchemaFactory.createForClass(Consumer);
