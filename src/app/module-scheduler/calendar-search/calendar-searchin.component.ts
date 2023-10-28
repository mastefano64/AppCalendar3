import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';

import { BookingDto } from '../model/booking/bookingdto';
import { SelectReservationArg } from '../model/selectreservationarg';
import { SearchReservation } from '../model/searchreservation';
import { CalendarSchedulerService } from '../service/calendar-scheduler-service';
import { CalendarConfig } from '../model/calendarconfig';
import { Utility } from '../../appcore/utility';

@Component({
  selector: 'app-calendarsearchover',
  templateUrl: './calendar-searchin.component.html',
  styleUrls: ['./calendar-searchin.component.scss']
})
export class CalendarSearchInComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() config: CalendarConfig;
  @Output() selectreservation = new EventEmitter<SelectReservationArg>();
  @ViewChild('fastsearch') fastsearch: ElementRef;
  bookings: BookingDto[];
  listbookings: BookingDto[];
  sub: Subscription;
  years = '0';
  months = '0';
  days = '0';
  name = '';

  count = 0;
  page = 0;
  pagesize = 9999;
  colord = 'id';
  coldir = 'asc';

  columns: [
    { name: 'Id' },
    { name: 'Room' },
    { name: 'Arrivo' },
    { name: 'Partenza' },
    { name: 'Nome' },
  ];

  constructor(public scheduler: CalendarSchedulerService) {}

  ngOnInit(): void {
    this.listbookings = this.scheduler.bookings;
    this.sub = this.scheduler.notifyBooking$.subscribe(response => {
      const result = response as BookingDto[];
      this.listbookings = result;
    });
  }

  ngAfterViewInit(): void {
    this.sub = fromEvent(this.fastsearch.nativeElement, 'keyup').pipe(
      map((event: any) => (event.target as HTMLInputElement).value),
      debounceTime(150),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.name = this.fastsearch.nativeElement.value;
        const search = new SearchReservation(+this.years, +this.months, +this.days, this.name);
        return this.config.service.getReservationByName(search);
      }),
    ).subscribe((response) => {
      const result = response as BookingDto[];
      this.listbookings = result;
    });
  }

  onYearsChange(data): void {
    this.years = data.value;
    const search = new SearchReservation(+this.years, +this.months, +this.days, this.name);
    this.config.service.getReservationByName(search).subscribe((response) => {
      const result = response as BookingDto[];
      this.listbookings = result;
    });
  }

  onMonthsChange(data): void {
    this.months = data.value;
    const search = new SearchReservation(+this.years, +this.months, +this.days, this.name);
    this.config.service.getReservationByName(search).subscribe((response) => {
      const result = response as BookingDto[];
      this.listbookings = result;
    });
  }

  onDaysChange(data): void {
    this.days = data.value;
    const search = new SearchReservation(+this.years, +this.months, +this.days, this.name);
    this.config.service.getReservationByName(search).subscribe((response) => {
      const result = response as BookingDto[];
      this.listbookings = result;
    });
  }

  onActivate(event): void {
    if (event.type == 'click') {
      const selected = event.row;
      const roomId = selected.roomId;
      const startDate = selected.startDate;
      const endDate = selected.endDate;
      const currBookingId = selected.bookingId;
      const args = new SelectReservationArg(roomId, startDate, endDate, currBookingId);
      this.selectreservation.emit(args);
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
