import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ResenaService } from './resena.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Resena')
@ApiBearerAuth('JWT-auth')
@Controller('resena')
export class ResenaController {
  constructor(
    private readonly resenaService: ResenaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Resena' })
  @ApiBody({ type: CreateResenaDto })
  @ApiResponse({ status: 201, description: 'Resena creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createResenaDto: CreateResenaDto) {
    const data = await this.resenaService.create(createResenaDto);
    return {
      success: true,
      message: 'Resena creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Resena' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Resena' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Resena no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.resenaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { resena: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Resenas' })
  @ApiResponse({ status: 200, description: 'Lista de Resenas' })
  async findAll() {
    const data = await this.resenaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get('perfume/:perfumeId')
  @ApiOperation({ summary: 'Obtener reseñas de un perfume' })
  @ApiParam({ name: 'perfumeId', description: 'ID del perfume' })
  @ApiResponse({ status: 200, description: 'Lista de reseñas del perfume' })
  async findByPerfume(@Param('perfumeId') perfumeId: string) {
    const data = await this.resenaService.findByPerfume(perfumeId);
    return { success: true, data, total: data.length };
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ summary: 'Obtener reseñas de un cliente' })
  @ApiParam({ name: 'clienteId', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Lista de reseñas del cliente' })
  async findByCliente(@Param('clienteId') clienteId: string) {
    const data = await this.resenaService.findByCliente(clienteId);
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Resena por ID' })
  @ApiParam({ name: 'id', description: 'ID del Resena' })
  @ApiResponse({ status: 200, description: 'Resena encontrado' })
  @ApiResponse({ status: 404, description: 'Resena no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.resenaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Resena' })
  @ApiParam({ name: 'id', description: 'ID del Resena' })
  @ApiBody({ type: UpdateResenaDto })
  @ApiResponse({ status: 200, description: 'Resena actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Resena no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateResenaDto: UpdateResenaDto
  ) {
    const data = await this.resenaService.update(id, updateResenaDto);
    return {
      success: true,
      message: 'Resena actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Resena' })
  @ApiParam({ name: 'id', description: 'ID del Resena' })
  @ApiResponse({ status: 200, description: 'Resena eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Resena no encontrado' })
  async remove(@Param('id') id: string) {
    const resena = await this.resenaService.findOne(id);
    if (resena.imagen) {
      const filename = resena.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.resenaService.remove(id);
    return { success: true, message: 'Resena eliminado exitosamente' };
  }
}
