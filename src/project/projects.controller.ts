import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateStatusProjectDto } from './dto/update-status-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Post('status')
  updateStatusProject(@Body() updateStatusProjectDto: UpdateStatusProjectDto) {
    return this.projectService.updateStatusProject(updateStatusProjectDto);
  }

  @Get('')
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  getProjectInfo(@Param('id') id: number) {
    return this.projectService.getProjectInfo(+id);
  }

  @Get(':id/tasks')
  getAllTaskInProject(@Param('id') id: number) {
    return this.projectService.getAllTaskInProject(+id);
  }

  @Get(':id/documents')
  getAllDocumentInProject(@Param('id') id: number) {
    return this.projectService.getAllDocumentInProject(+id);
  }

  @Get(':id/meetings')
  getAllMeetingInProject(@Param('id') id: number) {
    return this.projectService.getAllMeetingInProject(+id);
  }

  @Patch(':id')
  acceptProject(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.projectService.remove(+id);
  }
}
