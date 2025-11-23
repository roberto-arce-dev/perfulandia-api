import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResenaDocument = Resena & Document;

@Schema({ timestamps: true })
export class Resena {
  @Prop({ type: Types.ObjectId, ref: 'Perfume', required: true })
  perfume: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  cliente: Types.ObjectId;

  @Prop({ min: 1, max: 5 })
  puntuacion: number;

  @Prop()
  comentario?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ResenaSchema = SchemaFactory.createForClass(Resena);

ResenaSchema.index({ perfume: 1 });
ResenaSchema.index({ cliente: 1 });
ResenaSchema.index({ createdAt: -1 });
