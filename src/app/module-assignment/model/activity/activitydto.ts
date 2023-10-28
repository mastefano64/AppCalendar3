
export class ActivityDto {
  activityId: number;
  roomId: number;
  date: Date;
  startTime: string;
  endTime: string;
  stepDuration: number;
  name: string;
  title: string;
  description: string;
  extraData: { [name: string]: any };

  constructor() {
    this.activityId = 0;
    this.roomId = 1;
    this.date = undefined;
    this.startTime = '';
    this.endTime = '';
    this.stepDuration = 0;
    this.name = '';
    this.title = '';
    this.description = '';
    this.extraData = {};
  }
}
