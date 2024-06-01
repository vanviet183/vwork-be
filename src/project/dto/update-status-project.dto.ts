import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateStatusProjectDto extends PartialType(CreateProjectDto) {
  projectId: number;
  status: string;
}
