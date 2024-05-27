import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdatePasswordUserDto extends PartialType(CreateUserDto) {
  userId: number;
  oldPassword?: string;
  newPassword: string;
}
