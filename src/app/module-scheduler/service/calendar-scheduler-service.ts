import { Subject } from "rxjs";

import { PanelData } from "../model/paneldata";
import { BookingDto } from '../model/booking/bookingdto';
import { RoomDto } from "../model/room/roomdto";
import { CalendarConfig } from "../model/calendarconfig";
import { DateAndWeek, DateManager } from "../datemanager";
import { HeaderDays, MonthsDay } from "../model/headerdays";

export class CalendarSchedulerService {
  private notifyPanelPosition = new Subject<PanelData>();
  public notifyPanelPosition$ = this.notifyPanelPosition.asObservable();
  private notifyBooking = new Subject<BookingDto[]>();
  public notifyBooking$ = this.notifyBooking.asObservable();
  config: CalendarConfig;
  bookings: BookingDto[];
  panelposition: string;
  panelvisible: boolean;
  itembookingbehaviour : string;
  manager: DateManager;
  currymd: Date;
  currvalues: DateAndWeek;
  type: string;
  roomtype = '0';

  constructor() {
    this.manager = new DateManager();
  }

  registerSchedulerService(config: CalendarConfig) {
    this.config = config;
    this.itembookingbehaviour = this.config.defaultItemBookingBehaviour;
    this.panelposition = this.config.defaultPanelPosition;
    this.panelvisible = false;
  }

  notifyChangePanelPosition(panelposition: string, panelvisible: boolean) {
    const data = new PanelData();
    this.panelposition = panelposition;
    this.panelvisible = panelvisible;
    data.panelposition = panelposition;
    data.panelvisible = panelvisible;
    this.notifyPanelPosition.next(data);
  }

  notifyChangeBooking(rooms: RoomDto[], bookings: BookingDto[]) {
    this.bookings = bookings;
    const headerdays = this.createHeaderDays();
    for(let room of rooms) {
      const list = this.bookings.filter(b => b.roomId === room.roomId);
      for(let day of headerdays.headDaysAll) {
        for (const b of list) {
          if (day.date >= b.startDate && day.date <= b.endDate) {
            b.visible = true;
          }
        }
      }
    }
    this.notifyBooking.next(bookings);
  }

  createHeaderDays(): HeaderDays {
    const h = new HeaderDays();
    let currdate = new Date(this.currymd);
    const dd = currdate.getDate();
    const days = (dd === 1) ? this.manager.getDaysInTheMonth(currdate) : 31;
    for (let i = 0; i < days; i++) {
      if (i > 0) {
        currdate = this.manager.getNextDay(currdate);
      }
      const dw = this.manager.getDateAndWeekValues(currdate);
      h.headDaysAll.push(dw);
    }
    h.startDate = h.headDaysAll[0].date;
    h.endDate = h.headDaysAll[h.headDaysAll.length - 1].date;
    const firstmonth = h.headDaysAll[0].date.getMonth();
    for (const dayhead of h.headDaysAll) {
      if (dayhead.date.getMonth() === firstmonth) {
        h.headDays1.push(dayhead);
      } else {
        h.headDays2.push(dayhead);
      }
    }
    if (h.headDays1.length > 0) {
      const monthName1 = h.headDays1[0].monthName;
      const m1 = new MonthsDay(monthName1, h.headDays1.length);
      h.months.push(m1);
    }
    if (h.headDays2.length > 0) {
      const monthName2 = h.headDays2[0].monthName;
      const m2 = new MonthsDay(monthName2, h.headDays2.length);
      h.months.push(m2);
    }
    return h;
  }

  createCurrentValues(): void {
    this.currvalues = this.manager.getDateAndWeekValues(this.currymd);
  }
}
