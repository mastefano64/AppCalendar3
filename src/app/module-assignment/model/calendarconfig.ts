//import { IAssignmentService } from "../service/assignment-service";

export class CalendarConfig {
  //service: IAssignmentService
  enableGroupactivity = false;
  enablePanelHeadRoom = false;
  enablePanelSideRoom = false;
  panelHeadRoomHeight = '50px';
  panelSideRoomWidth = '300px';
  startHoursAM = 8;
  endHoursAM = 12;
  stepHoursAM = 0.5;
  startHoursPM = 14;
  endHoursPM = 18;
  stepHoursPM = 0.5;

  constructor() {

  }

}
