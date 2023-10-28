import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { SelectReservationArg } from '../model/selectreservationarg';
import { CalendarConfig } from '../model/calendarconfig';
import { Utility } from '../../appcore/utility';

@Component({
  selector: 'app-calendarsearchbtn',
  templateUrl: './calendar-searchout.component.html',
  styleUrls: ['./calendar-searchout.component.scss']
})
export class CalendarSearchOutComponent implements OnInit {
  @Input() config: CalendarConfig;
  @Output() selectreservation = new EventEmitter<SelectReservationArg>();
  isopen = false;

  constructor() { }

  ngOnInit(): void {

  }

  onReservationSelected(args: SelectReservationArg): void {
    this.isopen = false;
    this.selectreservation.emit(args);
  }

  onOpenClose(): void {
    this.isopen = !this.isopen;
  }

}
