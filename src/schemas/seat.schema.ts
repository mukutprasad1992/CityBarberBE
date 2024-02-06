// seat.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Provider } from './provider.schema';
import { User } from './user.schema';
import { Shop } from './shop.schema';

@Schema()
export class Seat extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  })
  provider: Provider;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop', required: true })
  shopId: Shop;

  @Prop({ type: [String], required: true })
  seatName: string[];
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
