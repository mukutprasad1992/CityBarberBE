// slot.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Slot extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop', required: true })
  shop: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  // Add other properties as needed
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
