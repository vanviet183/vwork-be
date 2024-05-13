import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateListUserDto } from './dto/create-list-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('create-list-user')
  @UseInterceptors(FileInterceptor('file'))
  createListUser(
    @Body() createListUserDto: CreateListUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createListUser(createListUserDto, file);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserInfo(@Param('id') id: string) {
    return this.userService.getUserInfo(+id);
  }

  @Get(':id/projects')
  getAllProjectsUserJoin(@Param('id') id: string) {
    return this.userService.getAllProjectsUserJoin(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
