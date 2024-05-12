import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

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
    let taskItem;
    if (createDocumentDto.taskId) {
      const task = await this.taskRepository.findOneBy({
        id: createDocumentDto.taskId,
      });

      if (!task) {
        throw new HttpException(
          'Công việc không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      taskItem = task;
    }

    const filePath = 'http://localhost:3005/' + file.path;

    const newDocument = {
      fileName: file.originalname,
      filePath: filePath,
      type: createDocumentDto.type,
      task: taskItem,
    };

    const document = await this.documentRepository.save(newDocument);

    return { message: 'Thêm tài liệu thành công', contents: { document } };
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
