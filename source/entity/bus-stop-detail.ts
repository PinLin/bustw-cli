export class BusStopDetail {
  id: string;

  subRouteId: string;

  status: number;

  estimateTime: number;

  buses: {
    plateNumber: string;

    status: number;

    approaching: number;
  }[];

}
