import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { BookingDto } from '../model/booking/bookingdto';
import { CalendarConfig } from '../model/calendarconfig';
import { Utility } from '../../appcore/utility';

@Component({
  selector: 'app-calendarlistitem',
  templateUrl: './calendar-list-item.component.html',
  styleUrls: ['./calendar-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarListItemComponent implements OnInit {
  @Input() config: CalendarConfig;
  @Input() booking: BookingDto;
  @Output() changefocuslistitemE = new EventEmitter<BookingDto>();
  @Output() changefocuslistitemL = new EventEmitter<BookingDto>();
  @Output() changedateitem = new EventEmitter<BookingDto>();
  @Output() dayreservationitem = new EventEmitter<BookingDto>();

  constructor() { }

  ngOnInit(): void {

  }

  onMouseEnter(item: BookingDto): void {
    this.changefocuslistitemE.emit(item);
  }

  onMouseLeave(item: BookingDto): void {
    this.changefocuslistitemL.emit(item);
  }

  onSelect(item: BookingDto): void {
    this.changedateitem.emit(item);
  }

  onEdit(item: BookingDto): void {
    this.dayreservationitem.emit(item);
  }
}
