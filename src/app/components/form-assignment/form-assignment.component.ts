import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { RoomDto } from '../../module-assignment/model/room/roomdto';
import { RoomTimeDto } from '../../module-assignment/model/roomtime/roomtimedto';
import { ActivityDto } from '../../module-assignment/model/activity/activitydto';
import { DateAndWeek, StepHours } from '../../module-assignment/datemanager';
import { AssignmentService } from '../../service/assignment-service';
import { CalendarConfig } from '../../module-assignment/model/calendarconfig';
import { Utility } from '../../appcore/utility';

@Component({
  selector: 'app-dialogassignment',
  templateUrl: './form-assignment.component.html',
  styleUrls: ['./form-assignment.component.css']
})
export class FormAssignmentComponent implements OnInit, OnDestroy  {
  title: string;
  activity: ActivityDto;
  type: string;
  $room: any;
  $roomtime: any;
  sub: Subscription;
  rooms: RoomDto[];
  roomtime: RoomTimeDto;
  roomId: number;
  stepdays: DateAndWeek[] = [];
  stephours: StepHours[] = [];
  config: CalendarConfig;
  startTimeId: any;
  endTimeId: any;

  // tslint:disable-next-line:max-line-length
  constructor(private dialogRef: MatDialogRef<FormAssignmentComponent>, private service:
            AssignmentService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.activity = new ActivityDto();
    this.type = data.type;
    this.config = data.config;
    this.title = (this.type === 'create') ? 'New' : 'Modify';
    if (data.type === 'create') {
      this.activity.date = data.param.date;
      this.activity.startTime = data.param.startTime;
      this.activity.endTime = data.param.endTime;
    } else {
      this.activity = data.param.activity;
    }
    this.roomId = this.activity.roomId;
    this.startTimeId = this.activity.startTime;
    this.endTimeId = this.activity.endTime;
    this.$room = data.room;
    this.$roomtime = data.roomtime;
  }

  ngOnInit() {
    this.sub = this.$room.subscribe(response => {
      const result = response as RoomDto[];
      this.rooms = result;
    });
    this.sub = this.$roomtime.subscribe(response => {
      const result = response as RoomTimeDto;
      this.roomtime = result;
    });
  }

  onConfirm(form: NgForm) {
    const vm = new ActivityDto();
    vm.activityId = this.activity.activityId;
    vm.date = this.activity.date;
    vm.roomId = Utility.toInteger(form.value.roomId);
    vm.startTime = Utility.toString(form.value.startTimeId);
    vm.endTime = Utility.toString(form.value.endTimeId);
    vm.title = Utility.toString(form.value.title);
    vm.description = Utility.toString(form.value.description);
    vm.extraData['firstName'] = Utility.toString(form.value.firstName);
    vm.extraData['lastName'] = Utility.toString(form.value.lastName);
    vm.name =  vm.extraData['firstName'] + ' ' + vm.extraData['lastName'] ;
    //
    if (vm.endTime < vm.startTime) {
      alert('Attention: startTime > endTime');
      return;
    }
    vm.stepDuration = this.computeStep(vm);
    //
    if (this.type === 'create') {
      this.service.insertActivity(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    } else {
      this.service.updateActivity(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    }
  }

  computeStep(activity: ActivityDto): number {
    let valret = 0;
    const start = activity.startTime.replace('.30', '.5');
    const end = activity.endTime.replace('.30', '.5');
    valret = ((parseFloat(end) - parseFloat(start)) / 0.5);
    return valret;
  }

  onDelete() {
    const id = this.activity.activityId;
    this.service.deleteActivity(id).subscribe(
      result => this.dialogRef.close(result),
      error => alert(error)
    );
  }

  onClose() {
    this.dialogRef.close('no');
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
