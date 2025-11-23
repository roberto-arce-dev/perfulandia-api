import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Resena, ResenaDocument } from './schemas/resena.schema';

@Injectable()
export class ResenaService {
  constructor(
    @InjectModel(Resena.name) private resenaModel: Model<ResenaDocument>,
  ) {}

  async create(createResenaDto: CreateResenaDto): Promise<Resena> {
    const nuevoResena = await this.resenaModel.create(createResenaDto);
    return nuevoResena;
  }

  async findAll(): Promise<Resena[]> {
    const resenas = await this.resenaModel.find();
    return resenas;
  }

  async findOne(id: string | number): Promise<Resena> {
    const resena = await this.resenaModel.findById(id)
    .populate('perfume', 'nombre marca precio')
    .populate('cliente', 'nombre');
    if (!resena) {
      throw new NotFoundException(`Resena con ID ${id} no encontrado`);
    }
    return resena;
  }

  async update(id: string | number, updateResenaDto: UpdateResenaDto): Promise<Resena> {
    const resena = await this.resenaModel.findByIdAndUpdate(id, updateResenaDto, { new: true })
    .populate('perfume', 'nombre marca precio')
    .populate('cliente', 'nombre');
    if (!resena) {
      throw new NotFoundException(`Resena con ID ${id} no encontrado`);
    }
    return resena;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.resenaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Resena con ID ${id} no encontrado`);
    }
  }
}
