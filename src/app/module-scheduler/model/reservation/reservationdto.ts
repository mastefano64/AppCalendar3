import { RoomDto } from '../room/roomdto';
import { BookingDto } from '../booking/bookingdto';

export class ReservationDto {
  rooms: RoomDto[];
  bookings: BookingDto[];
}
