import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrganizationService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('create')
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  // @Post('join')
  // join(@Body() joinOrganizationDto: JoinOrganizationDto) {
  //   return this.organizationService.join(joinOrganizationDto);
  // }

  @Get(':id/groups')
  getAllGroupInOrganization(@Param('id') id: number) {
    return this.organizationService.getAllGroupInOrganization(+id);
  }

  @Get(':id/users')
  getAllUserInOrganization(@Param('id') id: number) {
    return this.organizationService.getAllUserInOrganization(+id);
  }

  @Get(':id/projects')
  getAllProjectInOrganization(@Param('id') id: number) {
    return this.organizationService.getAllProjectInOrganization(+id);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  getOrganizationInfo(@Param('id') id: number) {
    return this.organizationService.getOrganizationInfo(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
