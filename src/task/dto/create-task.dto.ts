export class CreateTaskDto {
  projectId: number;
  taskName: string;
  phase: string;
  userResponsible: string;
  listUserImplement: number[];
  prioritize: string;
  startDate: string;
  endDate: string;
}
