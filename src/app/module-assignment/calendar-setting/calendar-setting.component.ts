import { Component, Input, OnInit } from '@angular/core';

import { MatRadioChange } from '@angular/material/radio';

import { CalendarAssignmentService } from '../service/calendar-assignment-service';
import { CalendarConfig } from '../model/calendarconfig';

@Component({
  selector: 'app-calendarsetting',
  templateUrl: './calendar-setting.component.html',
  styleUrls: ['./calendar-setting.component.scss']
})
export class CalendarSettingComponent implements OnInit {
  @Input() config: CalendarConfig;

  constructor(public assignment: CalendarAssignmentService) { }

  ngOnInit(): void {

  }

  onChangeRadioButton(radio: MatRadioChange): void {
    this.assignment.notifyChangeGroupActivity(radio.value);
  }
}
