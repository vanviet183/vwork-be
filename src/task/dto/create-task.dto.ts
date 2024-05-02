export class CreateTaskDto {
  projectId: number;
  taskName: string;
  userResponsible: number | undefined;
  listUserImplement: number[];
  prioritize: string;
  startDate: string;
  endDate: string;
}
