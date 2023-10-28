import { Subject } from "rxjs";

import { CalendarConfig } from "../model/calendarconfig";

export class CalendarAssignmentService {
  private notifyGroupActivity = new Subject<boolean>();
  public notifyGroupActivity$ = this.notifyGroupActivity.asObservable();
  config: CalendarConfig;
  groupactivity: boolean;

  constructor() { }

  registerAssignmentService(config: CalendarConfig) {
    this.config = config;
    this.groupactivity = this.config.enableGroupactivity;
  }

  notifyChangeGroupActivity(group: boolean) {
    this.notifyGroupActivity.next(group);
  }
}
