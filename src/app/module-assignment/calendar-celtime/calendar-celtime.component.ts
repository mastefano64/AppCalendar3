import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { StepHours } from '../datemanager';

@Component({
  selector: 'app-celtime',
  templateUrl: './calendar-celtime.component.html',
  styleUrls: ['./calendar-celtime.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarCelTimeComponent implements OnInit {
  @Input() hour: StepHours;

  constructor() { }

  ngOnInit(): void {

  }

}
