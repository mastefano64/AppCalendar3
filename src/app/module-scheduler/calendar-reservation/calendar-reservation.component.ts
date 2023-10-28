import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { RoomDto } from '../model/room/roomdto';
import { BookingDto } from '../model/booking/bookingdto';
import { DateAndWeek } from '../datemanager';
import { DayReservationArg } from '../model/dayreservationargs';
import { FocusCellArg } from '../model/focuscellargs';
import { CalendarConfig } from '../model/calendarconfig';
import { Utility } from '../../appcore/utility';

@Component({
  selector: 'app-calendar-reservation',
  templateUrl: './calendar-reservation.component.html',
  styleUrls: ['./calendar-reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarReservationComponent implements OnInit, OnChanges  {
  @Input() config: CalendarConfig;
  @Input() room: RoomDto;
  @Input() day: DateAndWeek;
  @Input() bookings: BookingDto[];
  @Input() currbookingid: number;
  @Output() changefocuscell = new EventEmitter<FocusCellArg>();
  @Output() dayreservation = new EventEmitter<DayReservationArg>();
  isreserved = false;
  isreservedSx = false;
  ishighlightSx = false;
  isreservedCx = false;
  ishighlightCx = false;
  isreservedDx = false;
  ishighlightDx = false;
  booking: BookingDto;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookings']) {
      this.datasourceChanged();
    }
    if (changes['currbookingid']) {
      this.datasourceChanged();
    }
  }

  onMouseEnter(b: BookingDto): void {
    const args = new FocusCellArg('enter', b);
    this.changefocuscell.emit(args);
  }

  onMouseLeave(b: BookingDto): void {
    const args = new FocusCellArg('leave', b);
    this.changefocuscell.emit(args);
  }

  onDayReservation(mouse: MouseEvent): void {
    const b = new BookingDto();
    if (this.booking) {
      b.bookingId = this.booking.bookingId;
      b.roomId = this.booking.roomId;
      b.roomType = this.booking.roomType;
      b.startDate = new Date(this.booking.startDate);
      b.endDate = new Date(this.booking.endDate);
      b.stayDay = this.booking.stayDay;
      b.name = this.booking.name;
      b.extraData = this.booking.extraData;
    }
    const args = new DayReservationArg(this.room.roomId, this.day.date, b);
    this.dayreservation.emit(args);
  }

  private datasourceChanged(): void {
    this.isreserved = false;
    this.isreservedSx = false;
    this.ishighlightSx = false;
    this.isreservedCx = false;
    this.ishighlightCx = false;
    this.isreservedDx = false;
    this.ishighlightDx = false;
    this.booking = undefined;
    const currid = this.currbookingid;
    const list = this.bookings.filter(b => b.roomId === this.room.roomId);
    for (const b of list) {
      if (this.day.date >= b.startDate &&  this.day.date <= b.endDate) {
        // b.visible = true; // onPush
        this.isreserved = true;
        const d = this.day.date.getTime();
        if (d === b.startDate.getTime() && d !== b.endDate.getTime()) {
          this.booking = b;
          this.isreservedDx = true;
          if (currid === b.bookingId) {
            this.ishighlightDx = true;
          } else {
            this.ishighlightDx = false;
          }
        }
        if (d !== b.startDate.getTime() && d !== b.endDate.getTime()) {
          this.booking = b;
          this.isreservedCx = true;
          if (currid === b.bookingId) {
            this.ishighlightCx = true;
          } else {
            this.ishighlightCx = false;
          }
        }
        if (d !== b.startDate.getTime() && d === b.endDate.getTime()) {
          this.isreservedSx = true;
          if (currid === b.bookingId) {
            this.ishighlightSx = true;
          } else {
            this.ishighlightSx = false;
          }
        }
      }
    }
  }

}
