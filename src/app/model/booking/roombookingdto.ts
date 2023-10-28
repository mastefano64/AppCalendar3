import { BookingDto } from "../../module-scheduler/model/booking/bookingdto";

export class RoomBookingDto extends BookingDto {
  firstName: string;
  lastName: string;

  constructor() {
    super();
    this.lastName = '';
    this.visible = false;
  }

}
