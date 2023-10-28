import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { CalendarSchedulerService } from '../service/calendar-scheduler-service';
import { BookingDto } from '../model/booking/bookingdto';
import { DateManager } from '../datemanager';
import { SelectReservationArg } from '../model/selectreservationarg';
import { ChangeDateArg } from '../model/changedatearg';
import { CalendarConfig } from '../model/calendarconfig';
import { Utility } from '../../appcore/utility';

// changedate => changereservation

@Component({
  selector: 'app-calendarnavbar',
  templateUrl: './calendar-navbar.component.html',
  styleUrls: ['./calendar-navbar.component.scss']
})
export class CalendarNavbarComponent implements OnInit {
  @Input() config: CalendarConfig;
  @Input() day: number;
  @Input() month: number;
  @Input() year: number;
  @Input() statusbar: BookingDto;
  @Output() changedate = new EventEmitter<ChangeDateArg>();
  datpicker: Date;
  manager: DateManager;

  constructor(public scheduler: CalendarSchedulerService) {
    this.manager = new DateManager();
  }

  ngOnInit(): void {
    this.scheduler.type = 'month';
    const roomtype = +this.scheduler.roomtype;
    this.scheduler.currymd = new Date(this.year, this.month - 1, 1);
    this.datpicker = new Date(this.scheduler.currymd);
    this.scheduler.createCurrentValues();
    const hd = this.scheduler.createHeaderDays();
    const args = new ChangeDateArg(this.scheduler.type, 'init', roomtype, hd, 0);
    this.changedate.emit(args);
  }

  onOpenClosPanelList(): void {
    this.scheduler.panelvisible = !this.scheduler.panelvisible;
  }

  onRoomChange(data): void {
    this.scheduler.roomtype = data.value;
    this.changeDays(this.scheduler.type, 'refresh');
  }

  onPickerChange(e): void {
    this.scheduler.type = 'month';
    const date = Utility.toDate(e.value);
    date.setDate(1);
    this.scheduler.currymd = new Date(date);
    this.changeDays(this.scheduler.type, 'refresh');
  }

  onPrev15Day(): void {
    this.scheduler.type = '15day';
    const d = new Date(this.manager.getPrevMonth(this.scheduler.currymd));
    d.setDate(15);
    this.scheduler.currymd = new Date(d);
    this.changeDays(this.scheduler.type, 'prev');
  }

  onNext15Day(): void {
    this.scheduler.type = '15day';
    const d = new Date(this.manager.getNextMonth(this.scheduler.currymd));
    d.setDate(15);
    this.scheduler.currymd = new Date(d);
    this.changeDays(this.scheduler.type, 'next');
  }

  onPrevMonth(): void {
    if (this.scheduler.type === '15day') {
      const d = this.manager.getDaysInTheMonth(this.scheduler.currymd);
      this.scheduler.currymd = new Date(this.scheduler.currymd.getFullYear(),
                  this.scheduler.currymd.getMonth(), 1);
    } else {
      this.scheduler.currymd = new Date(this.manager.getPrevMonth(this.scheduler.currymd));
    }
    this.scheduler.type = 'month';
    this.changeDays(this.scheduler.type, 'prev');
  }

  onNextMonth(): void {
    if (this.scheduler.type === '15day') {
      const d = this.manager.getDaysInTheMonth(this.scheduler.currymd);
      this.scheduler.currymd = new Date(this.scheduler.currymd.getFullYear(),
                  this.scheduler.currymd.getMonth(), d);
    } else {
      this.scheduler.currymd = new Date(this.manager.getNextMonth(this.scheduler.currymd));
    }
    this.scheduler.type = 'month';
    this.changeDays(this.scheduler.type, 'next');
  }

  onReservationSelected(args: SelectReservationArg): void {
    this.scheduler.type = 'month';
    const d = new Date(args.startDate);
    d.setDate(1);
    this.scheduler.currymd = new Date(d);
    this.changeDays(this.scheduler.type, 'refresh', args.currbookingid);
  }

  private changeDays(type: string, operation: string, currbookingid: number = 0): void {
    const roomtype = +this.scheduler.roomtype;
    this.datpicker = new Date(this.scheduler.currymd);
    this.scheduler.createCurrentValues();
    const headerdays = this.scheduler.createHeaderDays();
    const args = new ChangeDateArg(type, operation, roomtype, headerdays, currbookingid);
    this.changedate.emit(args);
  }

}
