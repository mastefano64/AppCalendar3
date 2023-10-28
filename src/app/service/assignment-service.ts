import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, delay, throwError, of } from "rxjs";

import { ActivityDto } from '../module-assignment/model/activity/activitydto';
import { RoomDto } from '../module-assignment/model/room/roomdto';
import { RoomTimeDto } from '../module-assignment/model/roomtime/roomtimedto';
import { ChangeActivityArg } from '../module-assignment/model/changeactivityarg';
import { KeyValuePair } from '../module-assignment/model/keyvaluepair';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private activities: any;

  constructor(private http: HttpClient) {}

  getRooms(): Observable<object> {
    let rooms: RoomDto[];

    rooms = this.getAllRoom();

    return of(rooms).pipe( delay(300) );
  }

  getRoomTime(): Observable<object> {
    let roomtime: RoomTimeDto;

    roomtime = this.getAllRoomTime();

    return of(roomtime).pipe( delay(300) );
  }

  getActivity(search: ChangeActivityArg): Observable<object> {
    let list = this.getActivityList();

    if (search.roomId !== 0) {
      list = list.filter(l => l.roomId === search.roomId);
    }

    if (search.type === 'giorno') {
      list = list.filter(l => l.date.getTime() === search.date.getTime());
    } else {
      list = list.filter(l => l.date.getTime() >= search.dateStart.getTime()
                 && l.date.getTime() <= search.dateEnd.getTime());
    }

    return of(list).pipe( delay(300) );
  }

  insertActivity(activity: ActivityDto): Observable<string> {
    const list = this.getActivityList();

    for (const item of list) {
      if (activity.date.getTime() === item.date.getTime()) {
        if (activity.activityId !== item.activityId && activity.roomId === item.roomId) {
          if (activity.startTime >= item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong startTime ' + activity.startTime);
          }
          if (activity.endTime > item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong endTime ' + activity.endTime);
          }
        }
      }
    }
    activity.activityId = this.maxValue(list) + 1;
    list.push(activity);

    return of('ok').pipe( delay(300) );
  }

  updateActivity(activity: ActivityDto): Observable<string> {
    const list = this.getActivityList();

    for (const item of list) {
      if (activity.date.getTime() === item.date.getTime()) {
        if (activity.activityId !== item.activityId && activity.roomId === item.roomId) {
          if (activity.startTime >= item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong startTime ' + activity.startTime);
          }
          if (activity.endTime > item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong endTime ' + activity.endTime);
          }
        }
      }
    }
    const index = list.findIndex(x => x.activityId === activity.activityId);
    list[index] = activity;

    return of('ok').pipe( delay(300) );
  }

  deleteActivity(id: number): Observable<string> {
    const list = this.getActivityList();

    const index = list.findIndex(x => x.activityId === id);
    list.splice(index, 1);

    return of('ok').pipe( delay(300) );
  }

  getAllRoom(): RoomDto[] {
    const r = new Array<RoomDto>();
    let room: RoomDto;

    room = new RoomDto();
    room.roomId = 1;
    room.roomName = 'Rooom 1';
    room.roomType = 1;
    room.roomTypeName = [ 'a' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 2;
    room.roomName = 'Rooom 2';
    room.roomType = 1;
    room.roomTypeName = [ 'b' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 3;
    room.roomName = 'Rooom 3';
    room.roomType = 1;
    room.roomTypeName = [ 'c' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 4;
    room.roomName = 'Rooom 4';
    room.roomType = 1;
    room.roomTypeName = [ 'd' ];
    r.push(room);

    return r;
  }

  getAllRoomTime(): RoomTimeDto {
    const data = new RoomTimeDto();

    data.startTimes.push(new KeyValuePair<string, string>('08.00', '08.00'));
    data.startTimes.push(new KeyValuePair<string, string>('08.30', '08.30'));
    data.startTimes.push(new KeyValuePair<string, string>('09.00', '09.00'));
    data.startTimes.push(new KeyValuePair<string, string>('09.30', '09.30'));
    data.startTimes.push(new KeyValuePair<string, string>('10.00', '10.00'));
    data.startTimes.push(new KeyValuePair<string, string>('10.30', '10.30'));
    data.startTimes.push(new KeyValuePair<string, string>('11.00', '11.00'));
    data.startTimes.push(new KeyValuePair<string, string>('11.30', '11.30'));
    data.startTimes.push(new KeyValuePair<string, string>('12.00', '12.00'));
    data.startTimes.push(new KeyValuePair<string, string>('14.00', '14.00'));
    data.startTimes.push(new KeyValuePair<string, string>('14.30', '14.30'));
    data.startTimes.push(new KeyValuePair<string, string>('15.00', '15.00'));
    data.startTimes.push(new KeyValuePair<string, string>('15.30', '15.30'));
    data.startTimes.push(new KeyValuePair<string, string>('16.00', '16.00'));
    data.startTimes.push(new KeyValuePair<string, string>('16.30', '16.30'));
    data.startTimes.push(new KeyValuePair<string, string>('17.00', '17.00'));
    data.startTimes.push(new KeyValuePair<string, string>('17.30', '17.30'));

    data.endTimes.push(new KeyValuePair<string, string>('08.30', '08.30'));
    data.endTimes.push(new KeyValuePair<string, string>('09.00', '09.00'));
    data.endTimes.push(new KeyValuePair<string, string>('09.30', '09.30'));
    data.endTimes.push(new KeyValuePair<string, string>('10.00', '10.00'));
    data.endTimes.push(new KeyValuePair<string, string>('10.30', '10.30'));
    data.endTimes.push(new KeyValuePair<string, string>('11.00', '11.00'));
    data.endTimes.push(new KeyValuePair<string, string>('11.30', '11.30'));
    data.endTimes.push(new KeyValuePair<string, string>('12.00', '12.00'));
    data.endTimes.push(new KeyValuePair<string, string>('14.00', '14.00'));
    data.endTimes.push(new KeyValuePair<string, string>('14.30', '14.30'));
    data.endTimes.push(new KeyValuePair<string, string>('15.00', '15.00'));
    data.endTimes.push(new KeyValuePair<string, string>('15.30', '15.30'));
    data.endTimes.push(new KeyValuePair<string, string>('16.00', '16.00'));
    data.endTimes.push(new KeyValuePair<string, string>('16.30', '16.30'));
    data.endTimes.push(new KeyValuePair<string, string>('17.00', '17.00'));
    data.endTimes.push(new KeyValuePair<string, string>('17.30', '17.30'));
    data.endTimes.push(new KeyValuePair<string, string>('18.00', '18.00'));

    return data;
  }

  private getActivityList(): ActivityDto[] {
    if (this.activities) {
      const list = cloneDeep(this.activities);
      return this.activities;
    }
    const b = new Array<ActivityDto>();
    this.activities = b;

    let index = 1;
    let flag = false;
    for (let y = 2018; y < 2020; ++y) {
      for (let m = 0; m < 12; ++m) {
        const dm = new Date(y, m + 1, 0);
        for (let d = 0; d < dm.getDate(); ++d) {
          const dt = new Date(y, m, d);
          if (dt.getDay() === 1) {
            if (flag === false) {
              this.createActivity1(b, y, m, d, index);
              index = index + 26;
              flag = true;
            } else {
              this.createActivity2(b, y, m, d, index);
              index = index + 13;
              flag = false;
            }
          }
        }
      }
    }

    return cloneDeep(b);
  }

  private createActivity1(a, y, m, d, bid) {
    let activity: ActivityDto;

    activity = new ActivityDto();
    activity.activityId = bid;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '08.00';
    activity.endTime = '08.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 1;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 2;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '15.00';
    activity.endTime = '15.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 3;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '16.00';
    activity.endTime = '16.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new ActivityDto();
    activity.activityId = bid + 4;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 5;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 6;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 7;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 8;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 9;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 10;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new ActivityDto();
    activity.activityId = bid + 11;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '08.00';
    activity.endTime = '08.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 12;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 13;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '15.00';
    activity.endTime = '15.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 14;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '16.00';
    activity.endTime = '16.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new ActivityDto();
    activity.activityId = bid + 15;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 16;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 17;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 18;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 19;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 20;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 21;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new ActivityDto();
    activity.activityId = bid + 22;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '08.00';
    activity.endTime = '08.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 23;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 24;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '15.00';
    activity.endTime = '15.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 25;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '16.00';
    activity.endTime = '16.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
  }

  private createActivity2(a, y, m, d, bid) {
    let activity: ActivityDto;

    activity = new ActivityDto();
    activity.activityId = bid;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 1;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 2;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 3;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 4;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 5;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 6;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new ActivityDto();
    activity.activityId = bid + 7;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 8;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 9;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 10;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 11;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 12;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new ActivityDto();
    activity.activityId = bid + 13;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.name = 'name ' + activity.activityId;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
  }

  private maxValue(list: ActivityDto[]): number {
    return list.reduce((max, p) => p.activityId > max ?
         p.activityId : max, list[0].activityId);
  }

}
