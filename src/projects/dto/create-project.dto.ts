export class CreateProjectDto {
  organizationId: number;
  name: string;
  status: number | 1;
  startDate: string;
  endDate: string;
  prioritize: number | 1;
}
