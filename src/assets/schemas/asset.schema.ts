import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AssetType } from "../asser-type.enum";

@Schema({ timestamps: true, collection: 'assets' })
export class Asset {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true, index: 'text' })
  name: string;

  @Prop()
  picture?: string;

  @Prop({
    required: true,
    enum: Object.values(AssetType),
    index: true
  })
  assetType: AssetType;

  @Prop({ required: true, unique: true, index: true })
  serial: string;

  @Prop()
  description?: string;

  @Prop({
    type: [{
      name: { type: String, required: true },
      key: { type: String, index: true },
      description: String,
      unit: { type: String, required: true },
      dataPoints: [{
        t: { type: Number, required: true }, // Timestamp (seconds)
        v: { type: Number, required: true }  // Value
      }]
    }],
    default: []
  })
  dataChannels: {
    name: string;
    key?: string;
    description?: string;
    unit: string;
    dataPoints: { t: number; v: number }[];
  }[];
}

export type AssetDocument = Asset & Document;
export const AssetSchema = SchemaFactory.createForClass(Asset);
