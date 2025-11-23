import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { UploadModule } from '../upload/upload.module';
import { Resena, ResenaSchema } from './schemas/resena.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resena.name, schema: ResenaSchema }]),
    UploadModule,
  ],
  controllers: [ResenaController],
  providers: [ResenaService],
  exports: [ResenaService],
})
export class ResenaModule {}
