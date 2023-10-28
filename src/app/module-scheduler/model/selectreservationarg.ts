
export class SelectReservationArg {

  constructor(public roomId: number, public startDate: Date, public endDate: Date,
                       public currbookingid: number = 0) { }

}
