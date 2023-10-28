import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { StepHours } from '../datemanager';
import { RoomDto } from '../model/room/roomdto';
import { ActivityDto } from '../model/activity/activitydto';
import { ActivityData } from '../model/activitydata';
import { ActivityCreateArg } from '../model/activitycreatearg';
import { ActivityEditArg } from '../model/activityeditarg';
import { StatusbarArg } from '../model/changestatusbarargs';
import { CalendarConfig } from '../model/calendarconfig';
import { FocusCellArg } from '../model/focuscellargs';

@Component({
  selector: 'app-activity',
  templateUrl: './calendar-activity.component.html',
  styleUrls: ['./calendar-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarActivityComponent implements OnInit, OnChanges {
  @Input() config: CalendarConfig;
  @Input() slectedview: string;
  @Input() date: Date;
  @Input() hour: StepHours;
  @Input() rooms: RoomDto[];
  @Input() datasource: ActivityDto[];
  @Input() curractivityid: number;
  @Output() changestatusbar = new EventEmitter<StatusbarArg>();
  @Output() changefocuscell = new EventEmitter<FocusCellArg>();
  @Output() createactivity = new EventEmitter<ActivityCreateArg>();
  @Output() editactivity = new EventEmitter<ActivityEditArg>();
  activities: ActivityData[];
  hasActivity: boolean;

  constructor() {
    this.activities = [];
    this.hasActivity = false;
  }

  ngOnInit(): void{

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasource']) {
      this.datasourceChanged();
    }
    if (changes['curractivityid']) {
      this.datasourceChanged();
    }
  }

  classRoomBox(activity: ActivityData): string {
    let valret = '';
    valret += `activtyRoomBox${activity.position} `;
    if (activity.ishighlight === true) {
      valret += `activtyRoomBoxHighlight `;
    } else {
      valret += `activtyRoomBoxColor${activity.activity.roomId} `;
    }
    return valret;
  }

  onMouseEnter(a: ActivityData): void {
    const roomname = this.getRoomName(a.activity.roomId);
    const args1 = new StatusbarArg('enter', roomname, a.activity);
    this.changestatusbar.emit(args1);
    const args2 = new FocusCellArg('enter', a.activity);
    this.changefocuscell.emit(args2);
  }

  onMouseLeave(a: ActivityData): void {
    const roomname = this.getRoomName(a.activity.roomId);
    const args1 = new StatusbarArg('leave', roomname, a.activity);
    this.changestatusbar.emit(args1);
    const args2 = new FocusCellArg('leave', a.activity);
    this.changefocuscell.emit(args2);
  }

  onCreateActivityClick(event: Event): void {
    event.stopPropagation();
    const args = new ActivityCreateArg(new Date(this.date), this.hour.startTime, this.hour.endTime);
    this.createactivity.emit(args);
  }

  onEditActivityClick(event: Event, data: ActivityData): void {
    event.stopPropagation();
    const args = new ActivityEditArg(Object.assign({}, data.activity));
    this.editactivity.emit(args);
  }

  private datasourceChanged(): void {
    this.activities = [];
    this.hasActivity = false;
    const currid = this.curractivityid;
    // if (this.datasource.length === 0) {
    //   return;
    // }
    let activities = this.datasource.filter(
      a => a.date.getTime() === this.date.getTime()
    );
    activities = activities.sort((a, b) => {
      if (a.roomId < b.roomId) {
        return -1;
      }
      if (a.roomId > b.roomId) {
        return +1;
      }
      return 0;
    });
    for (const activity of activities) {
      const a1 = parseFloat(activity.startTime);
      const a2 = parseFloat(this.hour.startTime);
      const b1 = parseFloat(activity.endTime);
      const b2 = parseFloat(this.hour.endTime);
      if (a2 >= a1 && b2 <= b1) {
        const ad = new ActivityData();
        ad.activity = activity;
        if (a2 === a1 && b2 === b1) {
          if (currid === activity.activityId) {
            ad.ishighlight = true;
          } else {
            ad.ishighlight = false;
          }
          ad.position = 1;
        }
        if (a2 === a1 && b2 !== b1) {
          if (currid === activity.activityId) {
            ad.ishighlight = true;
          } else {
            ad.ishighlight = false;
          }
          ad.position = 2;
        }
        if (a2 !== a1 && b2 !== b1) {
          if (currid === activity.activityId) {
            ad.ishighlight = true;
          } else {
            ad.ishighlight = false;
          }
          ad.position = 3;
        }
        if (a2 !== a1 && b2 === b1) {
          if (currid === activity.activityId) {
            ad.ishighlight = true;
          } else {
            ad.ishighlight = false;
          }
          ad.position = 4;
        }
        this.activities.push(ad);
        this.hasActivity = true;
      }
    }
  }

  private getRoomName(roomid: number): string {
    let valret = '';
    const room = this.rooms.find(x => x.roomId === roomid);
    valret = room.roomName;
    return valret;
  }
}
