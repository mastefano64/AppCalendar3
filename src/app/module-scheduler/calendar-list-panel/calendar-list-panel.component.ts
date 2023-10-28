import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';

import { BookingDto } from '../model/booking/bookingdto';
import { ChangeDateArg } from '../model/changedatearg';
import { FocusCellArg } from '../model/focuscellargs';
import { SelectReservationArg } from '../model/selectreservationarg';
import { DayReservationArg } from '../model/dayreservationargs';
import { CalendarSchedulerService } from '../service/calendar-scheduler-service';
import { CalendarConfig } from '../model/calendarconfig';
import { Utility } from '../../appcore/utility';

import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-calendarlistpanel',
  templateUrl: './calendar-list-panel.component.html',
  styleUrls: ['./calendar-list-panel.component.scss']
})
export class CalendarListPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() config: CalendarConfig;
  @Output() changefocuslist = new EventEmitter<FocusCellArg>();
  @Output() changedate = new EventEmitter<ChangeDateArg>();
  @Output() selectreservation = new EventEmitter<SelectReservationArg>();
  @Output() dayreservation = new EventEmitter<DayReservationArg>();
  @ViewChild('fastsearch') fastsearch: ElementRef;
  bookings: BookingDto[];
  listbookings: BookingDto[];
  listbookingsbak: BookingDto[];
  sub: Subscription;
  typeorder = '2';
  searchtext = '';
  years = '0';
  months = '0';
  days = '0';
  name = '';

  constructor(public scheduler: CalendarSchedulerService) { }

  ngOnInit(): void {
    this.listbookings = []; this.listbookingsbak = [];
    this.sub = this.scheduler.notifyBooking$.subscribe(response => {
      const result = response as BookingDto[];
      this.listbookings = result;
      this.listbookingsbak = result;
      this.onOrderListChange();
      this.searchtext = '';
    });
  }

  ngAfterViewInit(): void {
    this.sub = fromEvent(this.fastsearch.nativeElement, 'keyup').pipe(
      map((event: any) => (event.target as HTMLInputElement).value),
      debounceTime(150),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.listbookings = this.listbookingsbak.filter(
        l => l.name.toLowerCase().includes(value.toLowerCase()) === true
      );
    });
  }

  onOrderListChange(): void {
    let list = [ ...this.listbookings ];
    if (this.typeorder === '1') {
      list = list.sort((a, b) => {
        if (a.roomNumber < b.roomNumber) {
          return -1;
        }
        if (a.roomNumber > b.roomNumber) {
          return 1;
        }
        return 0;
      });
    }
    if (this.typeorder === '2') {
      list = list.sort((a, b) => {
        if (a.startDate < b.startDate) {
          return -1;
        }
        if (a.startDate > b.startDate) {
          return 1;
        }
        return 0;
      });
    }
    if (this.typeorder === '3') {
      list = list.sort((a, b) => {
        if (a.endDate < b.endDate) {
          return -1;
        }
        if (a.endDate > b.endDate) {
          return 1;
        }
        return 0;
      });
    }
    this.listbookings = list;
  }

  onMouseEnter(b: BookingDto): void {
    if (this.scheduler.itembookingbehaviour === 'select') {
      return;
    }
    if (b.visible === false) {
      return;
    }
    const args = new FocusCellArg('enter', b);
    this.changefocuslist.emit(args);
  }

  onMouseLeave(b: BookingDto): void {
    if (this.scheduler.itembookingbehaviour === 'select') {
      return;
    }
    if (b.visible === false) {
      return;
    }
    const args = new FocusCellArg('leave', b);
    this.changefocuslist.emit(args);
  }

  onSelect(selected: BookingDto): void {
    if (this.scheduler.itembookingbehaviour === 'over'
               && selected.visible === true) {
      return;
    }
    let currbookingid = 0;
    if (this.scheduler.itembookingbehaviour === 'select') {
      currbookingid = selected.bookingId;
    }
    this.scheduler.type = 'month';
    const d = new Date(selected.startDate);
    d.setDate(1);
    this.scheduler.currymd = new Date(d);
    const roomtype = +this.scheduler.roomtype;
    this.scheduler.createCurrentValues();
    const headerdays = this.scheduler.createHeaderDays();
    const args2 = new ChangeDateArg(this.scheduler.type, 'refresh',
               roomtype, headerdays, currbookingid);
    this.changedate.emit(args2);
  }

  onEdit(item: BookingDto): void {
    const b = new BookingDto();
    b.bookingId = item.bookingId;
    b.roomId = item.roomId;
    b.roomType = item.roomType;
    b.startDate = new Date(item.startDate);
    b.endDate = new Date(item.endDate);
    b.stayDay = item.stayDay;
    b.name = item.name;
    b.extraData = item.extraData;
    const args = new DayReservationArg(item.roomId, b.startDate, b);
    this.dayreservation.emit(args);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
