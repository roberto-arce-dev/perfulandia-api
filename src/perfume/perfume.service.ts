import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
