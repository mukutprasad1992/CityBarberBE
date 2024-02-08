// slot-booking.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SlotBookingDocument = SlotBooking & Document;

@Schema()
export class SlotBooking extends Document {
  @Prop({ required: true, type: String })
  shop: string;

  @Prop({ required: true, type: String })
  service: string;

  @Prop({ required: true, type: String })
  slot: string;

  @Prop({ required: true, type: String })
  user: string;

  @Prop({ required: true, type: String })
  date: string;

  @Prop({ required: true, type: String })
  slotTime: string;
}

export const SlotBookingSchema = SchemaFactory.createForClass(SlotBooking);
