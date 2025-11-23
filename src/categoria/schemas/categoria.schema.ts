import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoriaDocument = Categoria & Document;

@Schema({ timestamps: true })
export class Categoria {
  @Prop({ unique: true })
  nombre: string;

  @Prop({ enum: ['fragancia', 'tamaño', 'genero'] })
  tipo?: string;

  @Prop()
  descripcion?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);

CategoriaSchema.index({ nombre: 1 });
CategoriaSchema.index({ tipo: 1 });
