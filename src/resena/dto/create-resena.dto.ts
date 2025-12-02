import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateResenaDto {
  @ApiProperty({
    example: '6640c3d355d6305c6a8e9f21',
    description: 'ID del perfume reseñado',
  })
  @IsNotEmpty()
  @IsMongoId()
  perfume: string;

  @ApiProperty({
    example: '6640c3d355d6305c6a8e9f99',
    description: 'ID del cliente que realiza la reseña',
  })
  @IsNotEmpty()
  @IsMongoId()
  cliente: string;

  @ApiProperty({
    example: 5,
    description: 'Puntuación otorgada (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @ApiPropertyOptional({
    example: 'Excelente duración y proyección.',
    description: 'Comentario opcional',
  })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/resenas/aventus.jpg',
    description: 'URL de una imagen adjunta a la reseña',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/resenas/aventus-thumb.jpg',
    description: 'URL del thumbnail generado',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
