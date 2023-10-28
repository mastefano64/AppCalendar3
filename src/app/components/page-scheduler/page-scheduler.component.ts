import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { FormSchedulerComponent } from '../form-scheduler/form-scheduler.component';
import { RoomDto } from '../../module-scheduler/model/room/roomdto';
import { ReservationDto } from '../../module-scheduler/model/reservation/reservationdto';
import { BookingDto } from '../../module-scheduler/model/booking/bookingdto';
import { ChangeReservationArg } from '../../module-scheduler/model/changereservationarg';
import { DayReservationArg } from '../../module-scheduler/model/dayreservationargs';
import { CalendarSchedulerService } from '../../module-scheduler/service/calendar-scheduler-service';
import { SchedulerService } from '../../service/scheduler-service';
import { CalendarConfig } from '../../module-scheduler/model/calendarconfig';

@Component({
  selector: 'app-pagescheduler',
  templateUrl: './page-scheduler.component.html',
  styleUrls: ['./page-scheduler.component.scss'],
  providers: [ CalendarSchedulerService ]
})
export class PageSchedulerComponent implements OnInit, OnDestroy  {
  year: number;
  month: number;
  day: number;
  currentsearch: ChangeReservationArg;
  sub: Subscription;
  rooms: RoomDto[] = [];
  bookings: BookingDto[] = [];
  config: CalendarConfig;

  constructor(private dialog: MatDialog, private scheduler: CalendarSchedulerService,
          private service: SchedulerService, private cd: ChangeDetectorRef) {
    // const d = new Date();
    const d = new Date(2019, 2, 4);
    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.day = d.getDate();
    this.rooms = [];
    this.bookings = [];

    this.config = new CalendarConfig();
    this.config.service = service;
  }

  ngOnInit(): void {

  }

  onReservationChanged(args: ChangeReservationArg): void {
    this.currentsearch = args;
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
    this.sub = this.service.getReservations(args).subscribe(result => {
      const r = result as ReservationDto;
      this.rooms = r.rooms;
      this.bookings = r.bookings;
      this.scheduler.notifyChangeBooking(this.rooms, this.bookings);
      this.cd.detectChanges();
    });
  }

  onDayReservation(args: DayReservationArg): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = '650px';
    dialogConfig.disableClose = true;
    const list = this.service.getRooms();
    dialogConfig.data = { roomid: args.roomid, date: args.date, booking: args.booking, rooms: list };
    const dialogRef = this.dialog.open(FormSchedulerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'ok') {
        this.onReservationChanged(this.currentsearch);
      }
      if (data === 'no') {
      }
    });
  }

  ngOnDestroy(): void {

  }
}
