import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from '../app.material.module';

import { CalendarComponent } from './calendar/calendar.component';
import { CalendarNavbarComponent } from './calendar-navbar/calendar-navbar.component';
import { CalendarCelDateComponent } from './calendar-celdate/calendar-celdate.component';
import { CalendarCelTimeComponent } from './calendar-celtime/calendar-celtime.component';
import { CalendarActivityComponent } from './calendar-activity/calendar-activity.component';
import { CalendarSettingComponent } from './calendar-setting/calendar-setting.component';
import { PanelHeadRoomDirective } from './directive/panel-head-room.directive';
import { PanelSideRoomDirective } from './directive/panel-side-room.directive';
import { CelHighlightDirective } from './directive/celhighlight.directive';


@NgModule({
  declarations: [
    CalendarComponent,
    CalendarNavbarComponent,
    CalendarCelDateComponent,
    CalendarCelTimeComponent,
    CalendarActivityComponent,
    CalendarSettingComponent,
    PanelHeadRoomDirective,
    PanelSideRoomDirective,
    CelHighlightDirective
  ],
  exports: [
    CalendarComponent,
    CalendarNavbarComponent,
    CalendarCelDateComponent,
    CalendarCelTimeComponent,
    CalendarActivityComponent,
    CalendarSettingComponent,
    PanelHeadRoomDirective,
    PanelSideRoomDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule
  ]
})
export class AssignmentModule { }
