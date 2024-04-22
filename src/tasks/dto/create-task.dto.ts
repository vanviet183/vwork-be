export class CreateTaskDto {
  userId: number;
  projectId: number;
  taskName: string;
  prioritize: boolean;
  startDate: string;
  endDate: string;
  parentTaskId?: number;
}
