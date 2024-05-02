import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import * as path from 'path';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ) {
    const task = await this.taskRepository.findOneBy({
      id: createDocumentDto.taskId,
    });

    if (!task) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const currentPath = path.join(__dirname);
    const indexOfDist = currentPath.indexOf('dist');

    const filePath = currentPath.slice(0, indexOfDist) + file.path;

    console.log('filePath', filePath);

    const newDocument = {
      fileName: file.originalname,
      filePath: filePath,
    };

    return this.documentRepository.save(newDocument);
  }

  findAll() {
    return `This action returns all documents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
