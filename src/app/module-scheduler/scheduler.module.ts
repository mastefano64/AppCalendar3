import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from '../app.material.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ResizableModule } from 'angular-resizable-element';

import { CalendarComponent } from './calendar/calendar.component';
import { CalendarNavbarComponent } from './calendar-navbar/calendar-navbar.component';
import { CalendarListPanelComponent } from './calendar-list-panel/calendar-list-panel.component';
import { CalendarListItemComponent } from './calendar-list-item/calendar-list-item.component';
import { CalendarReservationComponent } from './calendar-reservation/calendar-reservation.component';
import { CalendarSearchOutComponent } from './calendar-search/calendar-searchout.component';
import { CalendarSearchInComponent } from './calendar-search/calendar-searchin.component';
import { CalendarSettingComponent } from './calendar-setting/calendar-setting.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarNavbarComponent,
    CalendarListPanelComponent,
    CalendarListItemComponent,
    CalendarReservationComponent,
    CalendarSearchOutComponent,
    CalendarSearchInComponent,
    CalendarSettingComponent
  ],
  exports: [
    CalendarComponent,
    CalendarNavbarComponent,
    CalendarListPanelComponent,
    CalendarListItemComponent,
    CalendarReservationComponent,
    CalendarSearchOutComponent,
    CalendarSearchInComponent,
    CalendarSettingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    NgxDatatableModule,
    ResizableModule
  ]
})
export class ShedulerModule { }
