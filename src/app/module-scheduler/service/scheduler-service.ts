import { Observable } from 'rxjs';

import { BookingDto } from '../model/booking/bookingdto';
import { SearchReservation } from '../model/searchreservation';


export interface ISchedulerService {
  getReservationByName(args: SearchReservation): Observable<BookingDto[]>
}
