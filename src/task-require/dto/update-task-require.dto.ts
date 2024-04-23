import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskRequireDto } from './create-task-require.dto';

export class UpdateTaskRequireDto extends PartialType(CreateTaskRequireDto) {}
