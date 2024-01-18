// cat.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserType = 'consumer' | 'provider';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: ['consumer', 'provider'], default: 'consumer' })
  userType: UserType;
}
export const UserSchema = SchemaFactory.createForClass(User);
