import { KeyValuePair } from '../keyvaluepair';

export class RoomTimeDto {
  startTimes: KeyValuePair<string, string>[];
  endTimes: KeyValuePair<string, string>[];

  constructor() {
    this.startTimes = [];
    this.endTimes = [];
  }

}
