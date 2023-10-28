import { ISchedulerService } from "../service/scheduler-service";

export class CalendarConfig {
  service: ISchedulerService
  defaultPanelPosition = 'aside';
  defaultItemBookingBehaviour = 'over';

  constructor() {

  }

}
