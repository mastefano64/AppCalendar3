import { DateAndWeek } from '../datemanager';
import { HeaderDays } from './headerdays';

export class ChangeDateArg {

  constructor(public type: string, public operation: string, public roomtype: number,
            public days: HeaderDays, public currbookingid: number) { }

}
