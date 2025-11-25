import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePerfumeDto } from './dto/create-perfume.dto';
import { UpdatePerfumeDto } from './dto/update-perfume.dto';
import { Perfume, PerfumeDocument } from './schemas/perfume.schema';

@Injectable()
export class PerfumeService {
  constructor(
    @InjectModel(Perfume.name) private perfumeModel: Model<PerfumeDocument>,
  ) {}

  async create(createPerfumeDto: CreatePerfumeDto): Promise<Perfume> {
    const nuevoPerfume = await this.perfumeModel.create(createPerfumeDto);
    return nuevoPerfume;
  }

  async findAll(): Promise<Perfume[]> {
    const perfumes = await this.perfumeModel.find();
    return perfumes;
  }

  async findOne(id: string | number): Promise<Perfume> {
    const perfume = await this.perfumeModel.findById(id)
    .populate('categoria', 'nombre descripcion');
    if (!perfume) {
      throw new NotFoundException(`Perfume con ID ${id} no encontrado`);
    }
    return perfume;
  }

  async update(id: string | number, updatePerfumeDto: UpdatePerfumeDto): Promise<Perfume> {
    const perfume = await this.perfumeModel.findByIdAndUpdate(id, updatePerfumeDto, { new: true })
    .populate('categoria', 'nombre descripcion');
    if (!perfume) {
      throw new NotFoundException(`Perfume con ID ${id} no encontrado`);
    }
    return perfume;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.perfumeModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Perfume con ID ${id} no encontrado`);
    }
  }

  async findByCategoria(categoriaId: string): Promise<Perfume[]> {
    const perfumes = await this.perfumeModel
      .find({ categoria: new Types.ObjectId(categoriaId) })
      .populate('categoria', 'nombre descripcion')
      .sort({ createdAt: -1 });
    return perfumes;
  }

  async filtrarPerfumes(filtros: {
    genero?: string;
    fragancia?: string;
    tamaño?: string;
    precioMin?: number;
    precioMax?: number;
  }): Promise<Perfume[]> {
    const query: any = {};

    // Filtrar por género si está presente
    if (filtros.genero) {
      query.genero = { $regex: filtros.genero, $options: 'i' };
    }

    // Filtrar por fragancia si está presente
    if (filtros.fragancia) {
      query.fragancia = { $regex: filtros.fragancia, $options: 'i' };
    }

    // Filtrar por tamaño si está presente
    if (filtros.tamaño) {
      query.tamaño = { $regex: filtros.tamaño, $options: 'i' };
    }

    // Filtrar por rango de precios
    if (filtros.precioMin || filtros.precioMax) {
      query.precio = {};
      if (filtros.precioMin) {
        query.precio.$gte = filtros.precioMin;
      }
      if (filtros.precioMax) {
        query.precio.$lte = filtros.precioMax;
      }
    }

    const perfumes = await this.perfumeModel
      .find(query)
      .populate('categoria', 'nombre descripcion')
      .sort({ createdAt: -1 });
    
    return perfumes;
  }
}
