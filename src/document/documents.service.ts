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

    if (createDocumentDto.taskId > 0) {
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

    const idProject =
      createDocumentDto.projectId > 0 ? createDocumentDto.projectId : undefined;
    const newDocument = {
      fileName: file.originalname,
      filePath: filePath,
      type: createDocumentDto.type,
      task: taskItem,
      isSaved: createDocumentDto.isSaved,
    };

    const documentItem = await this.documentRepository.save(newDocument);
    if (idProject) {
      documentItem.idProject = idProject;
    }

    const document = await this.documentRepository.save(documentItem);

    return { message: 'Thêm tài liệu thành công', contents: { document } };
  }

  findAll() {
    return `This action returns all documents`;
  }

  async getDocumentInfo(id: number) {
    const document = await this.documentRepository.findOneBy({ id });
    if (!document) {
      throw new HttpException('Tài liệu không tồn tại', HttpStatus.NOT_FOUND);
    }
    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.documentRepository
      .createQueryBuilder()
      .update(Document)
      .set({
        type: updateDocumentDto.type,
        isSaved: updateDocumentDto.isSaved,
      })
      .where('id = :id', { id: updateDocumentDto.documentId })
      .execute();

    if (!document) {
      throw new HttpException('Tài liệu không tồn tại', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Cập nhật tài liệu dự án thành công',
      contents: { document },
    };
  }

  async remove(id: number) {
    const document = await this.documentRepository.findOneBy({ id });
    if (!document) {
      throw new HttpException('Tài liệu không tồn tại', HttpStatus.NOT_FOUND);
    }

    await this.documentRepository.remove(document);

    return { message: 'Xoá tài liệu thành công' };
  }
}
