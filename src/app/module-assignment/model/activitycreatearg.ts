import { ActivityDto } from './activity/activitydto';

export class ActivityCreateArg {

  constructor(public date: Date, public startTime: string, public endTime: string) { }

}
