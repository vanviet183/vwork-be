import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserInfoDto extends PartialType(CreateUserDto) {
  userId: number;
  birthday: string;
}
