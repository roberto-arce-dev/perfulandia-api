import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePerfumeDto {
  @ApiProperty({
    example: 'Aventus',
    description: 'Nombre del perfume',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Creed',
    description: 'Marca del perfume',
  })
  @IsNotEmpty()
  @IsString()
  marca: string;

  @ApiPropertyOptional({
    example: 'Cítrica',
    description: 'Familia olfativa o fragancia',
  })
  @IsOptional()
  @IsString()
  fragancia?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Tamaño en mililitros',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tamaño?: number;

  @ApiPropertyOptional({
    example: 'hombre',
    enum: ['hombre', 'mujer', 'unisex'],
    description: 'Género al que está orientado',
  })
  @IsOptional()
  @IsEnum(['hombre', 'mujer', 'unisex'])
  genero?: string;

  @ApiProperty({
    example: 199.99,
    description: 'Precio de venta',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiPropertyOptional({
    example: 25,
    description: 'Stock disponible',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: '663f0f6b55d6305c6a8e9f21',
    description: 'Categoría asociada',
  })
  @IsOptional()
  @IsMongoId()
  categoria?: string;

  @ApiPropertyOptional({
    example: 'Notas de piña, bergamota y almizcle con alta fijación.',
    description: 'Descripción del perfume',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/perfumes/aventus.jpg',
    description: 'URL de la imagen principal',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/perfumes/aventus-thumb.jpg',
    description: 'URL del thumbnail generado',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
