import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerfumeService } from './perfume.service';
import { PerfumeController } from './perfume.controller';
import { UploadModule } from '../upload/upload.module';
import { Perfume, PerfumeSchema } from './schemas/perfume.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Perfume.name, schema: PerfumeSchema }]),
    UploadModule,
  ],
  controllers: [PerfumeController],
  providers: [PerfumeService],
  exports: [PerfumeService],
})
export class PerfumeModule {}
