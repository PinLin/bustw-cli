import { Bus } from './bus';

export class BusStopDetail {
  id: string;

  subRouteId: string;

  status: number;

  estimateTime: number;

  buses: Bus[];
}
