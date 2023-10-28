import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, delay, throwError, of } from "rxjs";

import { RoomDto } from '../module-scheduler/model/room/roomdto';
import { ReservationDto } from '../module-scheduler/model/reservation/reservationdto';
import { BookingDto } from '../module-scheduler/model/booking/bookingdto';
import { ChangeReservationArg } from '../module-scheduler/model/changereservationarg';
import { SearchReservation } from '../module-scheduler/model/searchreservation';
import { ISchedulerService } from "../module-scheduler/service/scheduler-service";
import { DateManager } from "../module-scheduler/datemanager";
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService implements ISchedulerService {
  bookings: BookingDto[];
  index = 1;

  constructor(private http: HttpClient) {}

  getRooms(): Observable<object> {
    let rooms: RoomDto[];

    rooms = this.getAllRoom();

    return of(rooms).pipe( delay(300) );
  }

  getReservations(args: ChangeReservationArg): Observable<object> {
    const res = new ReservationDto();

    let list1 = this.getAllRoom();
    if (args.roomtype !== 0) {
      list1 = list1.filter(l => l.roomType === args.roomtype);
    }
    res.rooms  = list1;

    const m = new DateManager();
    const startDate = m.getAddDay(args.startDate, -30);
    const endDate = m.getAddDay(args.endDate, +60);
    let list2 = this.getAllBooking();
    if (args.roomtype !== 0) {
      list2 = list2.filter(l => l.roomType === args.roomtype);
    }
    list2 = list2.filter(l => l.startDate >= startDate &&
                    l.endDate <= endDate);
    res.bookings = list2;

    return of(res).pipe( delay(300) );
  }

  getReservationByName(args: SearchReservation): Observable<BookingDto[]> {
    const persons = new Array<BookingDto>();

    if (args.year === 0 && args.month === 0 && args.day === 0 && args.name === '') {
      return of(persons);
    }

    let list = this.getAllBooking();
    if (args.year !== 0) {
      list = list.filter(l => l.startDate.getFullYear() === args.year);
    }
    if (args.month !== 0) {
      list = list.filter(l => l.startDate.getMonth() === args.month - 1);
    }
    if (args.day !== 0) {
      list = list.filter(l => l.startDate.getDate() === args.day);
    }
    if (args.name !== '') {
      list = list.filter(l => l.name.startsWith(args.name) === true);
    }

    for (const b of list) {
      const p = new BookingDto();
      p.bookingId = b.bookingId;
      p.roomId = b.roomId;
      p.roomType = b.roomType;
      p.roomNumber = this.getRoomById(p.roomId).roomNumber;
      p.roomTypeName = this.getRoomById(p.roomId).roomTypeName[0];
      p.startDate = b.startDate;
      p.endDate = b.endDate;
      p.stayDay = b.stayDay;
      p.name = b.name;
      persons.push(p);
    }

    return of(persons).pipe( delay(300) );
  }

  insertReservation(booking: BookingDto): Observable<string> {
    const list = this.bookings;

    for (const item of list) {
      if (booking.bookingId !== item.bookingId && booking.roomId === item.roomId) {
        if (booking.startDate >= item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong startDate: ' + booking.startDate.toString());
        }
        if (booking.endDate > item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong endDate: ' + booking.endDate.toString());
        }
      }
    }
    booking.bookingId = this.maxValue(list) + 1;
    list.push(booking);

    return of('ok').pipe( delay(300) );
  }

  updateReservation(booking: BookingDto): Observable<string> {
    const list = this.bookings;

    for (const item of list) {
      if (booking.bookingId !== item.bookingId && booking.roomId === item.roomId) {
        if (booking.startDate >= item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong startDate: ' + this.formatGMY(booking.startDate));
        }
        if (booking.endDate > item.startDate && booking.startDate < item.endDate) {
          return throwError('wrong endDate: ' + this.formatGMY(booking.endDate));
        }
      }
    }
    const index = list.findIndex(x => x.bookingId === booking.bookingId);
    list[index] = booking;

    return of('ok').pipe( delay(300) );
  }

  deleteReservation(id: number): Observable<string> {
    const list = this.bookings;

    const index = list.findIndex(x => x.bookingId === id);
    list.splice(index, 1);

    return of('ok').pipe( delay(300) );
  }

  private formatGMY(date: Date): string {
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  }

  private maxValue(list: BookingDto[]): number {
    return list.reduce((max, p) => p.bookingId > max ? p.bookingId : max, list[0].bookingId);
  }

  private cloneBooking(list: BookingDto[]): BookingDto[] {
    const a = new Array<BookingDto>();
    for (const b of list) {
      a.push(b);
    }
    return a;
  }

  private getRoomById(value: number): RoomDto {
    const list = this.getAllRoom();
    const r = list.filter(l => l.roomId === value)[0];
    return r;
  }

  private getAllRoom(): RoomDto[] {
    const r = new Array<RoomDto>();
    let room: RoomDto;

    room = new RoomDto();
    room.roomId = 1;
    room.roomNumber = '100';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 2;
    room.roomNumber = '101';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 3;
    room.roomNumber = '102';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 4;
    room.roomNumber = '104';
    room.roomType = 2;
    room.roomTypeName = [ 'Double' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 5;
    room.roomNumber = '105';
    room.roomType = 2;
    room.roomTypeName = [ 'Double' ];
    r.push(room);

    room = new RoomDto();
    room.roomId = 6;
    room.roomNumber = '200';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 7;
    room.roomNumber = '201';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 8;
    room.roomNumber = '202';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 9;
    room.roomNumber = '204';
    room.roomType = 2;
    room.roomTypeName = [ 'Double' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 10;
    room.roomNumber = '205';
    room.roomType = 2;
    room.roomTypeName = [ 'Double' ];
    r.push(room);

    room = new RoomDto();
    room.roomId = 11;
    room.roomNumber = '300';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 12;
    room.roomNumber = '301';
    room.roomType = 1;
    room.roomTypeName = [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 13;
    room.roomNumber = '302';
    room.roomType = 1;
    room.roomTypeName =  [ 'Single' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 14;
    room.roomNumber = '304';
    room.roomType = 2;
    room.roomTypeName = [ 'Double' ];
    r.push(room);
    room = new RoomDto();
    room.roomId = 15;
    room.roomNumber = '305';
    room.roomType = 2;
    room.roomTypeName = [ 'Double' ];
    r.push(room);

    return r;
  }

  private getAllBooking(): BookingDto[] {
    if (this.bookings) {
      const list = cloneDeep(this.bookings);
      return list;
    }
    const b = new Array<BookingDto>();
    this.bookings = b;

    this.index = 1;
    for (let y = 2018; y < 2020; ++y) {
      for (let m = 0; m < 12; ++m) {
        if ((m % 2) === 1) {
          this.createBokingDto1(b, y, m);
        } else {
          this.createBokingDto2(b, y, m);
        }
      }
    }
    //this.createBokingDto3(b, 0, 0);

    return cloneDeep(b);
  }

  private createBokingDto1(b, y, m) {
    let booking: BookingDto;

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 1;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 1;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 2;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 2;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 3;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 9);
    booking.endDate = new Date(y, m, 11);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 3;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 11);
    booking.endDate = new Date(y, m, 14);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 3;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 14);
    booking.endDate = new Date(y, m, 16);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 1;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 2;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 5;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 6;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personA-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 3;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 8;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
  }

  private createBokingDto2(b, y, m) {
    let booking: BookingDto;

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 4;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 4;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 5;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 5);
    booking.endDate = new Date(y, m, 10);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 5;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 15);
    booking.endDate = new Date(y, m, 20);
    booking.stayDay = 5;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 9;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 9);
    booking.endDate = new Date(y, m, 11);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 9;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 11);
    booking.endDate = new Date(y, m, 14);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 9;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 14);
    booking.endDate = new Date(y, m, 16);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 1;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 2;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 6;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 7;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 12);
    booking.endDate = new Date(y, m, 13);
    booking.stayDay = 1;
    booking.name = 'personB-' + booking.bookingId;
    b.push(booking);

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 3;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 8;
    booking.roomType = 1;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(y, m, 24);
    booking.endDate = new Date(y, m, 26);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
  }

  private createBokingDto3(b, y, m) {
    let booking: BookingDto;

    booking = new BookingDto();
    booking.bookingId = this.getIndex();
    booking.roomId = 4;
    booking.roomType = 2;
    booking.roomNumber = this.getRoomById(booking.roomId).roomNumber;
    booking.roomTypeName = this.getRoomById(booking.roomId).roomTypeName[0];
    booking.startDate = new Date(2019, 5, 15);
    booking.endDate = new Date(2019, 6, 15);
    booking.stayDay = 1;
    booking.name = 'personC-' + booking.bookingId;
    b.push(booking);
  }

  private getIndex(): number {
    const valret = this.index;
    this.index = this.index + 1;
    return valret;
  }
}
