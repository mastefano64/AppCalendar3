import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { FormAssignmentComponent } from '../form-assignment/form-assignment.component';
import { RoomDto } from 'src/app/module-assignment/model/room/roomdto';
import { ActivityDto } from '../../module-assignment/model/activity/activitydto';
import { ActivityCreateArg } from '../../module-assignment/model/activitycreatearg';
import { ActivityEditArg } from '../../module-assignment/model/activityeditarg';
import { ChangeActivityArg } from '../../module-assignment/model/changeactivityarg';
import { CalendarAssignmentService } from '../../module-assignment/service/calendar-assignment-service';
import { AssignmentService } from '../../service/assignment-service';
import { CalendarConfig } from '../../module-assignment/model/calendarconfig';

@Component({
  selector: 'app-pageassignment3',
  templateUrl: './page-assignment3.component.html',
  styleUrls: ['./page-assignment3.component.css'],
  providers: [ CalendarAssignmentService ]
})
export class PageAssignment3Component implements OnInit {
  year: number;
  month: number;
  day: number;
  currentsearch: ChangeActivityArg;
  sub: Subscription;
  datasource = [];
  rooms = [];
  config: CalendarConfig;

  constructor(private dialog: MatDialog, private service: AssignmentService,
                   private cd: ChangeDetectorRef) {
    // const d = new Date();
    const d = new Date(2019, 2, 4);
    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.day = d.getDate();
    this.datasource = [];
    this.rooms = [];

    this.config = new CalendarConfig();
    this.config.enablePanelHeadRoom = true;
    this.config.enablePanelSideRoom = true;
    //this.config.service = service;
   }

  ngOnInit() {
    this.service.getRooms().subscribe(result => {
      const r = result as RoomDto[];
      this.rooms = r;
    });
  }

  onActivityChanged(args: ChangeActivityArg) {
    this.currentsearch = args;
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
    this.sub = this.service.getActivity(args).subscribe(result => {
        this.datasource = result as ActivityDto[];
        this.cd.detectChanges();
      }
    );
  }

  onCreateActivity(args: ActivityCreateArg) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = '800px';
    dialogConfig.disableClose = true;
    const p1 = this.service.getRooms();
    const p2 = this.service.getRoomTime();
    dialogConfig.data = { type: 'create', config: this.config, param: args, room: p1, roomtime: p2 };
    const dialogRef = this.dialog.open(FormAssignmentComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'ok') {
        this.onActivityChanged(this.currentsearch);
      }
      if (data === 'no') {
      }
    });
  }

  onEditActivity(args: ActivityEditArg) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = '800px';
    dialogConfig.disableClose = true;
    const p1 = this.service.getRooms();
    const p2 = this.service.getRoomTime();
    dialogConfig.data = { type: 'edit', config: this.config, param: args, room: p1, roomtime: p2 };
    const dialogRef = this.dialog.open(FormAssignmentComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'ok') {
        this.onActivityChanged(this.currentsearch);
      }
      if (data === 'no') {
      }
    });
  }

}
