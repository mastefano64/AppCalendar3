
export class BookingDto {
  bookingId: number;
  roomId: number;
  roomNumber: string;
  roomType: number;
  roomTypeName: string;
  startDate: Date;
  endDate: Date;
  stayDay: number;
  name: string;
  extraData: { [name: string]: any };
  visible: boolean;

  constructor() {
    this.bookingId = 0;
    this.roomId = 0;
    this.roomNumber = '';
    this.roomType = 0;
    this.roomTypeName = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.stayDay = 0;
    this.name = '';
    this.extraData = {};
    this.visible = false;
  }

}
