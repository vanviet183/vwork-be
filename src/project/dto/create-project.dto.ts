export class CreateProjectDto {
  organizationId: number;
  userId: number;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
}
