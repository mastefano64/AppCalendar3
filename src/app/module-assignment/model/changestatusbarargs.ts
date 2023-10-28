import { ActivityDto } from './activity/activitydto';

export class StatusbarArg {

  constructor(public type: string, public roomname: string, public activity: ActivityDto) { }

}
