import { Module } from '@nestjs/common';
import { DocumentService } from './documents.service';
import { DocumentController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';
import { Document } from './entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Document])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
