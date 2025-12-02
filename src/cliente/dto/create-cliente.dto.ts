import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del cliente',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'cliente@example.com',
    description: 'Correo electrónico único del cliente',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '+51 900000000',
    description: 'Número de teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'Av. Principal 123, Lima',
    description: 'Dirección del cliente',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/clientes/juan.jpg',
    description: 'URL de la imagen de perfil',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/clientes/juan-thumb.jpg',
    description: 'URL del thumbnail generado',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
