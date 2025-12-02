import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PedidoItemDto {
  @ApiProperty({
    example: '663f0f6b55d6305c6a8e9f21',
    description: 'ID del perfume',
  })
  @IsNotEmpty()
  @IsMongoId()
  perfume: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad solicitada',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  cantidad: number;

  @ApiProperty({
    example: 120.5,
    description: 'Precio unitario al momento del pedido',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio: number;
}

export class CreatePedidoDto {
  @ApiPropertyOptional({
    example: '6640c3d355d6305c6a8e9f99',
    description: 'ID del cliente (solo ADMIN, por defecto se usa el cliente autenticado)',
  })
  @IsOptional()
  @IsMongoId()
  cliente?: string;

  @ApiProperty({
    type: [PedidoItemDto],
    description: 'Listado de perfumes incluidos en el pedido',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items: PedidoItemDto[];

  @ApiPropertyOptional({
    example: 241.0,
    description: 'Total del pedido (se recomienda calcularlo en backend)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  total?: number;

  @ApiPropertyOptional({
    example: 'pendiente',
    description: 'Estado del pedido',
    enum: ['pendiente', 'procesando', 'enviado', 'entregado'],
  })
  @IsOptional()
  @IsEnum(['pendiente', 'procesando', 'enviado', 'entregado'])
  estado?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/pedidos/123.jpg',
    description: 'URL de la imagen del pedido',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/pedidos/123-thumb.jpg',
    description: 'URL del thumbnail generado',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
