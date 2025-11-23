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
import { PerfumeService } from './perfume.service';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Perfume')
@ApiBearerAuth('JWT-auth')
@Controller('perfume')
export class PerfumeController {
  constructor(
    private readonly perfumeService: PerfumeService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Perfume' })
  @ApiBody({ type: CreatePerfumeDto })
  @ApiResponse({ status: 201, description: 'Perfume creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPerfumeDto: CreatePerfumeDto) {
    const data = await this.perfumeService.create(createPerfumeDto);
    return {
      success: true,
      message: 'Perfume creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Perfume' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Perfume' })
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
  @ApiResponse({ status: 404, description: 'Perfume no encontrado' })
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
    const updated = await this.perfumeService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { perfume: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Perfumes' })
  @ApiResponse({ status: 200, description: 'Lista de Perfumes' })
  async findAll() {
    const data = await this.perfumeService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Perfume por ID' })
  @ApiParam({ name: 'id', description: 'ID del Perfume' })
  @ApiResponse({ status: 200, description: 'Perfume encontrado' })
  @ApiResponse({ status: 404, description: 'Perfume no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.perfumeService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Perfume' })
  @ApiParam({ name: 'id', description: 'ID del Perfume' })
  @ApiBody({ type: UpdatePerfumeDto })
  @ApiResponse({ status: 200, description: 'Perfume actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfume no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updatePerfumeDto: UpdatePerfumeDto
  ) {
    const data = await this.perfumeService.update(id, updatePerfumeDto);
    return {
      success: true,
      message: 'Perfume actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Perfume' })
  @ApiParam({ name: 'id', description: 'ID del Perfume' })
  @ApiResponse({ status: 200, description: 'Perfume eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfume no encontrado' })
  async remove(@Param('id') id: string) {
    const perfume = await this.perfumeService.findOne(id);
    if (perfume.imagen) {
      const filename = perfume.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.perfumeService.remove(id);
    return { success: true, message: 'Perfume eliminado exitosamente' };
  }
}
