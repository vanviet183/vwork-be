export class CreateMeetingDto {
  projectId: number;
  userId: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  listUser: number[];
}
