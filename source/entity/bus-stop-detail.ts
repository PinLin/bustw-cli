export class BusStopDetail {
  id: string;

  status: number;

  estimateTime: number;

  buses: {
    plateNumber: string;

    status: number;

    approaching: number;
  }[];

}
