import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import { CalendarNavbarComponent } from '../calendar-navbar/calendar-navbar.component';
import { CalendarSchedulerService } from '../service/calendar-scheduler-service';
import { ChangeDateArg } from '../model/changedatearg';
import { ChangeReservationArg } from '../model/changereservationarg';
import { DayReservationArg } from '../model/dayreservationargs';
import { FocusCellArg } from '../model/focuscellargs';
import { RoomDto } from '../model/room/roomdto';
import { BookingDto } from '../model/booking/bookingdto';
import { HeaderDays } from '../model/headerdays';
import { ResizeEvent } from 'angular-resizable-element';
import { CalendarConfig } from '../model/calendarconfig';
import { Utility } from '../../appcore/utility';

// changedate => changereservation
// https://www.npmjs.com/package/angular-resizable-element

@Component({
  selector: 'app-calendar-scheduler',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild(CalendarNavbarComponent) navbar;
  @Input() config: CalendarConfig;
  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() rooms: RoomDto[];
  @Input() bookings: BookingDto[];
  @Output() changereservation = new EventEmitter<ChangeReservationArg>();
  @Output() dayreservation = new EventEmitter<DayReservationArg>();
  headerdays: HeaderDays;
  statusbar: BookingDto;
  currbookingid = 0;
  resizeWith = 300;

  constructor(public scheduler: CalendarSchedulerService) {
    this.rooms = [];
    this.bookings = [];
  }

  get currentYMD(): Date {
    if (this.navbar) {
      return this.navbar.currymd;
    } else {
      return undefined;
    }
  }

  ngOnInit(): void {
    this.scheduler.registerSchedulerService(this.config)
  }

  onResizeEnd(event: ResizeEvent): void {
    if (event.rectangle.width) {
      this.resizeWith = event.rectangle.width;
    }
  }

  onDateChanged(data: ChangeDateArg): void {
    this.headerdays = data.days;
    this.currbookingid = data.currbookingid;
    const startDate = data.days.startDate;
    const endDate = data.days.endDate;
    const roomtype = data.roomtype;
    const args = new ChangeReservationArg(data.type, data.operation,
                   roomtype, startDate, endDate);
    this.changereservation.emit(args);
  }

  onFocusListChanged(args: FocusCellArg): void {
    if (args.type === 'enter') {
      this.currbookingid = args.booking.bookingId;
    } else {
      this.currbookingid = 0;
    }
  }

  onFocusCellChanged(args: FocusCellArg): void {
    if (args.type === 'enter') {
      this.statusbar = args.booking;
    } else {
      this.statusbar = undefined;
    }
  }

  onDayReservation(args: DayReservationArg): void {
    this.dayreservation.emit(args);
  }

}
