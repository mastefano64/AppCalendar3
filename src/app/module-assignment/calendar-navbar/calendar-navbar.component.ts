import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { DateManager, DateAndWeek } from '../datemanager';
import { RoomDto } from '../model/room/roomdto';
import { ChangeDateArg } from '../model/changedatearg';
import { StatusbarMessage } from '../model/statusbarmessage';
import { CalendarConfig } from '../../module-assignment/model/calendarconfig';
import { Utility } from 'src/app/appcore/utility';

@Component({
  selector: 'app-calendarnavbar',
  templateUrl: './calendar-navbar.component.html',
  styleUrls: ['./calendar-navbar.component.scss']
})
export class CalendarNavbarComponent implements OnInit {
  @Input() config: CalendarConfig;
  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() slectedview: string;
  @Input() statusbar: StatusbarMessage;
  @Input() rooms: RoomDto[];
  @Input() manager: DateManager;
  @Output() changeday = new EventEmitter<ChangeDateArg>();
  @Output() changeweek = new EventEmitter<ChangeDateArg>();
  @Output() changemonth = new EventEmitter<ChangeDateArg>();
  @Output() changeroom = new EventEmitter<ChangeDateArg>();
  @Output() opensideroom = new EventEmitter<boolean>();
  @Output() changeview = new EventEmitter<string>();
  enablePanelSideRoom: boolean;
  isopensideroom = false;
  currymd: Date;
  currvalues: DateAndWeek;
  datpicker: Date;
  roomid = 0;

  constructor() { }

  ngOnInit(): void {
    this.enablePanelSideRoom = this.config.enablePanelSideRoom;
    this.currymd = new Date(this.year, this.month - 1, this.day);
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('init', this.roomid, this.currvalues);
    if (this.slectedview === 'giorno') {
      this.changeday.emit(args);
    } else {
      this.changeweek.emit(args);
    }
  }

  onRoomButton(): void {
    this.isopensideroom = !this.isopensideroom;
    this.opensideroom.emit(this.isopensideroom);
  }

  onViewChange(data: any): void {
    this.slectedview = data.value;
    if (this.slectedview === 'settimana') {
      this.setFirstDayOfWeek();
    }
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    this.changeview.emit(this.slectedview);
  }

  onRoomChange(data): void {
    this.roomid = data.value;
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('refresh', this.roomid, this.currvalues);
    this.changeroom.emit(args);
  }

  onPickerChange(e): void {
    this.slectedview = 'giorno';
    const date = Utility.toDate(e.value);
    this.currymd = new Date(date);
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('refresh', this.roomid, this.currvalues);
    this.changeview.emit(this.slectedview);
  }

  onPrevDay(): void {
    if (this.slectedview === 'settimana') {
      return;
    }
    this.currymd = new Date(this.manager.getPrevDay(this.currymd));
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('prev', this.roomid, this.currvalues);
    this.changeday.emit(args);
  }

  onNextDay(): void {
    if (this.slectedview === 'settimana') {
      return;
    }
    this.currymd = new Date(this.manager.getNextDay(this.currymd));
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('next', this.roomid, this.currvalues);
    this.changeday.emit(args);
  }

  onPrevWeek(): void {
    if (this.slectedview === 'giorno') {
      return;
    }
    this.currymd = new Date(this.manager.getPrevWeek(this.currymd));
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('prev', this.roomid, this.currvalues);
    this.changeweek.emit(args);
  }

  onNextWeek(): void {
    if (this.slectedview === 'giorno') {
      return;
    }
    this.currymd = new Date(this.manager.getNextWeek(this.currymd));
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('next', this.roomid, this.currvalues);
    this.changeweek.emit(args);
  }

  onPrevMonth(): void {
    if (this.slectedview === 'settimana') {
      return;
    }
    this.currymd = new Date(this.manager.getPrevMonth(this.currymd));
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('prev', this.roomid, this.currvalues);
    this.changemonth.emit(args);
  }

  onNextMonth(): void {
    if (this.slectedview === 'settimana') {
      return;
    }
    this.currymd = new Date(this.manager.getNextMonth(this.currymd));
    this.currvalues = this.getCurrentValues();
    this.datpicker = new Date(this.currymd);
    const args = new ChangeDateArg('next', this.roomid, this.currvalues);
    this.changemonth.emit(args);
  }

  getDaysOfWeek(): DateAndWeek[] {
    return this.manager.getDaysOfWeek(this.currymd);
  }

  private getCurrentValues(): DateAndWeek {
    return this.manager.getDateAndWeekValues(this.currymd);
  }

  private setFirstDayOfWeek(): void {
    const d1 = this.currymd.getDay();
    const d2 = this.currymd.getDate();
    const d3 = d2 - d1;
    this.currymd.setDate(d3);
  }

}
