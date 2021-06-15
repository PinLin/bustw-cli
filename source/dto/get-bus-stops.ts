export class GetBusStopsDto {
  stops: {
    id: string;
    subRouteId: string;
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
