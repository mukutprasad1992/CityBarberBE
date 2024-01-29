// service.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Shop } from './shop.schema';
import { Provider } from './provider.schema';
import { User } from './user.schema';

@Schema()
export class Service extends Document {
  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  servicePrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop', required: true })
  shop: Shop;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
  provider: Provider;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
