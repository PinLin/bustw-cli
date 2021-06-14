export class GetBusStopsDto {
  stops: {
    id: string;
    routeId: string;
    routeNameZhTw: string;
    status: number;
    estimateTime: number;
    buses: {
      plateNumber: string;
      status: number;
      approaching: number;
    }[];
  }[];
}
