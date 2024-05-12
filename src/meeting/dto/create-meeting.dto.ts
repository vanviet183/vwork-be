export class CreateMeetingDto {
  projectId: number;
  author: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  listUser: number[];
}
