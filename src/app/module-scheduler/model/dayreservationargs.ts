import { BookingDto } from '../model/booking/bookingdto';

export class DayReservationArg {

  constructor(public roomid: number, public date: Date, public booking: BookingDto) { }

}
