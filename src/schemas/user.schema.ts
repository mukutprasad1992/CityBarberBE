// cat.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose,{ Document,Model, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  contact: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

export const userModel: Model<User> =  mongoose.model('User', UserSchema);
