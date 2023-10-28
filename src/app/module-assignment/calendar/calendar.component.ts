import { Component, ContentChild, ElementRef, TemplateRef, Input, Output, EventEmitter, ViewChild,
      OnInit, OnChanges, AfterViewInit, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { CalendarNavbarComponent } from '../calendar-navbar/calendar-navbar.component';
import { CalendarAssignmentService } from '../service/calendar-assignment-service';
import { DateManager, DateAndWeek, StepHours } from '../datemanager';
import { RoomDto } from '../model/room/roomdto';
import { ActivityDto } from '../model/activity/activitydto';
import { ActivityCreateArg } from '../model/activitycreatearg';
import { ActivityEditArg } from '../model/activityeditarg';
import { ChangeActivityArg } from '../model/changeactivityarg';
import { ChangeDateArg } from '../model/changedatearg';
import { StatusbarArg } from '../model/changestatusbarargs';
import { FocusCellArg } from '../model/focuscellargs';
import { StatusbarMessage } from '../model/statusbarmessage';
import { PanelHeadRoomDirective } from '../directive/panel-head-room.directive';
import { PanelSideRoomDirective } from '../directive/panel-side-room.directive';
import { CalendarConfig } from '../model/calendarconfig';

@Component({
  selector: 'app-calendaractivity',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy  {
  @ViewChild('begintable' ) beginTable: ElementRef;
  @ContentChild(PanelHeadRoomDirective, { read: TemplateRef<any> }) panelHeadRoomTemplate;
  @ContentChild(PanelSideRoomDirective, { read: TemplateRef<any> }) panelSideRoomTemplate;
  @Input() config: CalendarConfig;
  @Input() year: number;
  @Input() month: number;
  @Input() day: number;
  @Input() rooms: RoomDto[];
  @Input() datasource: ActivityDto[];
  @Output() changeactivity = new EventEmitter<ChangeActivityArg>();
  @Output() createactivity = new EventEmitter<ActivityCreateArg>();
  @Output() editactivity = new EventEmitter<ActivityEditArg>();
  @ViewChild(CalendarNavbarComponent) navbar;
  sub: Subscription;
  slectedview = 'giorno';
  groupactivity = false;
  stepdays: DateAndWeek[] = [];
  stephours: StepHours[] = [];
  groupDatasource: any[] = [];
  curractivityid = 0;
  isopensideroom = false;
  statusbar: StatusbarMessage;
  manager: DateManager;
  enablePanelHeadRoom: boolean;
  enablePanelSideRoom: boolean;
  panelHeadRoomHeight: string;
  panelSideRoomWidth: string;
  offsetTop: string;

  constructor(public assignment: CalendarAssignmentService) {
    this.manager = new DateManager();
    this.rooms = [];
    this.datasource = [];
  }

  get currentRoom(): number {
    if (this.navbar) {
      return this.navbar.roomid;
    } else {
      return undefined;
    }
  }

  get currentYMD(): Date {
    if (this.navbar) {
      return this.navbar.currymd;
    } else {
      return undefined;
    }
  }

  ngOnInit(): void {
    this.enablePanelHeadRoom = this.config.enablePanelHeadRoom;
    this.panelHeadRoomHeight = this.config.panelHeadRoomHeight;
    this.enablePanelSideRoom = this.config.enablePanelSideRoom;
    this.panelSideRoomWidth = this.config.panelSideRoomWidth;
    this.assignment.registerAssignmentService(this.config)
    for (let i = this.config.startHoursAM; i <= this.config.endHoursAM; i = i + this.config.stepHoursAM) {
      const st = new StepHours();
      st.startTime = this.formatHours(i);
      st.endTime = this.formatHours(i + this.config.stepHoursAM);
      st.stepTime = (this.config.stepHoursAM * 60).toString();
      this.stephours.push(st);
    }
    for (let i = this.config.startHoursPM; i <= this.config.endHoursPM; i = i + this.config.stepHoursPM) {
      const st = new StepHours();
      st.startTime = this.formatHours(i);
      st.endTime = this.formatHours(i + this.config.stepHoursPM);
      st.stepTime = (this.config.stepHoursPM * 60).toString();
      this.stephours.push(st);
    }
    this.sub = this.assignment.notifyGroupActivity$.subscribe(response => {
      const result = response as boolean;
      this.groupactivity = result;
      //this.datasourceChanged();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasource']) {
      this.datasourceChanged();
    }
  }

  ngAfterViewInit(): void {
    this.calcOffsetTop();
  }

  onOpenSideRoom(value: boolean): void {
    this.isopensideroom = value;
  }

  onStatusbarChanged(args1: StatusbarArg): void {
    if (args1.type === 'enter') {
      const args2 = new StatusbarMessage();
      args2.rooomname = args1.roomname;
      args2.activity = args1.activity;
      this.statusbar = args2;
    } else {
      this.statusbar = undefined;
    }
  }

  onFocusCellChanged(args: FocusCellArg): void {
    if (args.type === 'enter') {
      this.curractivityid = args.activity.activityId;
    } else {
      this.curractivityid = 0;
    }
  }

  onViewChanged(value: string): void {
    this.slectedview = value;
    if (this.slectedview === 'settimana') {
      this.stepdays = this.navbar.getDaysOfWeek();
      this.notifyChangeActivity(2);
    } else {
      this.stepdays = [];
      this.notifyChangeActivity(1);
    }
    this.calcOffsetTop();
  }

  onDayChanged(args: ChangeDateArg): void {
    this.stepdays = [];
    this.notifyChangeActivity(1);
  }

  onWeekChanged(args: ChangeDateArg): void {
    this.stepdays = this.navbar.getDaysOfWeek();
    this.notifyChangeActivity(2);
  }

  onMonthChanged(args: ChangeDateArg): void {
    this.stepdays = [];
    this.notifyChangeActivity(1);
  }

  onRomChanged(args: ChangeDateArg): void {
    if (this.slectedview === 'settimana') {
      this.stepdays = this.navbar.getDaysOfWeek();
      this.notifyChangeActivity(2);
    } else {
      this.stepdays = [];
      this.notifyChangeActivity(1);
    }
  }

  onCreateActivityGroupClick(event: Event): void {
    event.stopPropagation();
    const args = new ActivityCreateArg(new Date(this.currentYMD), null, null);
    this.createactivity.emit(args);
  }

  onCreateActivity(args: ActivityCreateArg): void {
    this.createactivity.emit(args);
  }

  onEditActivity(args: ActivityEditArg): void {
    this.editactivity.emit(args);
  }

  private notifyChangeActivity(type: number): void {
    const param = (type === 1) ? 'giorno' : 'settimana';
    const ca = new ChangeActivityArg(param, this.slectedview, this.currentRoom);
    if (type === 1) {
      ca.date = new Date(this.currentYMD);
    } else {
      ca.dateStart = new Date(this.currentYMD);
      ca.dateEnd = new Date(this.currentYMD);
      ca.dateEnd.setDate(ca.dateStart.getDate() + 7);
    }
    this.changeactivity.emit(ca);
  }

  private formatHours(value: number): string {
    const hours = Math.floor(value);
    const minutes1 = (value % 1).toFixed(2);
    const minutes2 = parseFloat(minutes1) * 60;
    let s1 = hours.toString();
    let s2 = minutes2.toString();
    if (s1.length === 1) {
      s1 = '0' + s1;
    }
    if (s2.length === 1) {
      s2 = '0' + s2;
    }
    const hm = s1 + '.' + s2;
    return hm;
  }

  private datasourceChanged(): void {
    if (this.datasource.length === 0) {
      this.groupDatasource = [];
      return;
    }
    const group = Object.entries(this.datasource.reduce((acc, item) => {
      const roomId = item.roomId;
      if (!acc[roomId]) {
        acc[roomId] = [];
      }
      acc[roomId].push(item);
      return acc;
    }, {})).map(([roomId, items]) => {
      const room = this.rooms.find(x => x.roomId === +roomId);
      let group = {
        roomId: roomId,
        room: room,
        items: items,
      };
      return group;
    });
    this.groupDatasource = group;
  }

  private calcOffsetTop(): void {
    const ele = this.beginTable.nativeElement;
    this.offsetTop = ele.offsetTop + 'px';
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
