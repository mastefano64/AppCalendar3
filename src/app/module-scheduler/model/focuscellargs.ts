import { BookingDto } from '../model/booking/bookingdto';

export class FocusCellArg {

  constructor(public type: string, public booking: BookingDto) { }

}
