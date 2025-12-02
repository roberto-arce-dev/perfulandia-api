import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Aromáticos',
    description: 'Nombre único de la categoría',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 'fragancia',
    description: 'Clasificación de la categoría',
    enum: ['fragancia', 'tamaño', 'genero'],
  })
  @IsOptional()
  @IsEnum(['fragancia', 'tamaño', 'genero'])
  tipo?: string;

  @ApiPropertyOptional({
    example: 'Notas olfativas predominantes',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/aromaticos.jpg',
    description: 'URL de la imagen representativa',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/aromaticos-thumb.jpg',
    description: 'URL del thumbnail generado',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
