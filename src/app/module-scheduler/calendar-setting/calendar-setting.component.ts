import { Component, Input, OnInit } from '@angular/core';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

import { CalendarSchedulerService } from '../service/calendar-scheduler-service';
import { CalendarConfig } from '../model/calendarconfig';

@Component({
  selector: 'app-calendarsetting',
  templateUrl: './calendar-setting.component.html',
  styleUrls: ['./calendar-setting.component.scss']
})
export class CalendarSettingComponent implements OnInit {
  @Input() config: CalendarConfig;

  constructor(public scheduler: CalendarSchedulerService) { }

  ngOnInit(): void {

  }

  onChangeRadioButton(radio: MatRadioChange): void {
    this.scheduler.notifyChangePanelPosition(radio.value, false);
  }

  onChangeCheckbox(check: MatCheckboxChange): void {
    if (check.checked === true) {
      this.scheduler.itembookingbehaviour = 'over';
    } else {
      this.scheduler.itembookingbehaviour = 'select';
    }
  }
}
