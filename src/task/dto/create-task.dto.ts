export class CreateTaskDto {
  userId: number;
  projectId: number;
  taskName: string;
  prioritize: string;
  startDate: string;
  endDate: string;
  parentTaskId?: number;
}
