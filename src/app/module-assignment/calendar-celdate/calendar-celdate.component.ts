import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { DateAndWeek } from '../datemanager';

@Component({
  selector: 'app-celdate',
  templateUrl: './calendar-celdate.component.html',
  styleUrls: ['./calendar-celdate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarCelDateComponent implements OnInit {
  @Input() date: DateAndWeek;

  constructor() { }

  ngOnInit(): void {

  }

}
