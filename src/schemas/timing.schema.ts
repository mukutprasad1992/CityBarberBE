

    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
    import { Document, Schema as MongooseSchema } from 'mongoose';
    import { Shop } from '../schemas/shop.schema';

    @Schema()
    export class Timing extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Shop.name })
    shop: string;

    @Prop({ required: true })
    time: string;

    @Prop({ default: false })
    disabled: boolean;
    }

    export const TimingSchema = SchemaFactory.createForClass(Timing);
