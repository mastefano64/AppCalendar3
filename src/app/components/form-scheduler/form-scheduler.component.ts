import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BookingDto } from '../../module-scheduler/model/booking/bookingdto';
import { SchedulerService } from '../../service/scheduler-service';
import { Utility } from '../../appcore/utility';

@Component({
  selector: 'app-dialogscheduler',
  templateUrl: './form-scheduler.component.html',
  styleUrls: ['./form-scheduler.component.scss']
})
export class FormSchedulerComponent implements OnInit, OnDestroy  {
  title: string;
  $rooms: any;
  sub: Subscription;
  roomid: number;
  startDate: Date;
  endDate: Date;
  booking: BookingDto;
  rooms: any;

  // tslint:disable-next-line:max-line-length
  constructor(private dialogRef: MatDialogRef<FormSchedulerComponent>, private service: SchedulerService,
                           @Inject(MAT_DIALOG_DATA) private data: any) {
    this.roomid = data.roomid;
    if (data.booking.bookingId === 0) {
      this.title = 'Create ';
      this.startDate = data.date;
      this.endDate = data.date;
    } else {
      this.title = 'Edit ';
      this.startDate = data.booking.startDate;
      this.endDate = data.booking.endDate;
    }
    this.booking = data.booking as BookingDto;
    this.$rooms = data.rooms;
  }

  ngOnInit(): void {
    this.sub = this.$rooms.subscribe(result => {
      this.rooms = result;
    });
  }

  onConfirm(form: NgForm): void {
    if (form.invalid === true) {
      return;
    }
    const vm = new BookingDto();
    vm.bookingId = this.booking.bookingId;
    vm.roomId = Utility.toInteger(form.value.roomid);
    vm.startDate = Utility.toDate(form.value.startDate);
    vm.endDate = Utility.toDate(form.value.endDate);
    vm.extraData['firstName'] = Utility.toString(form.value.firstName);
    vm.extraData['lastName'] = Utility.toString(form.value.lastName);
    vm.name =  vm.extraData['firstName'] + ' ' + vm.extraData['lastName'] ;
    //
    if (vm.endDate < vm.startDate) {
      alert('Attention: startDate > endDate');
      return;
    }
    const index = this.rooms.findIndex(x => x.roomId === vm.roomId);
    vm.roomType = this.rooms[index].roomType;
    this.computeStayDay(vm.startDate, vm.endDate);
    //
    if (vm.bookingId === 0) {
      this.service.insertReservation(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    } else {
      this.service.updateReservation(vm).subscribe(
        result => this.dialogRef.close(result),
        error => alert(error)
      );
    }
  }

  onDelete(): void {
    const id = this.booking.bookingId;
    this.service.deleteReservation(id).subscribe(
      result => this.dialogRef.close(result),
      error => alert(error)
    );
  }

  onClose(): void {
    this.dialogRef.close('no');
  }

  private computeStayDay(startDate: Date, endDate: Date): number {
    const valret = 0;
    //
    // ???
    //
    return valret;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
