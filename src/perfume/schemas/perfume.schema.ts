import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PerfumeDocument = Perfume & Document;

@Schema({ timestamps: true })
export class Perfume {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  marca: string;

  @Prop()
  fragancia?: string;

  @Prop({ min: 0 })
  tamaño?: number;

  @Prop({ enum: ['hombre', 'mujer', 'unisex'] })
  genero?: string;

  @Prop({ min: 0 })
  precio: number;

  @Prop({ default: 0 })
  stock?: number;

  @Prop({ type: Types.ObjectId, ref: 'Categoria' })
  categoria: Types.ObjectId;

  @Prop()
  descripcion?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PerfumeSchema = SchemaFactory.createForClass(Perfume);

PerfumeSchema.index({ categoria: 1 });
PerfumeSchema.index({ nombre: 'text', marca: 'text' });
