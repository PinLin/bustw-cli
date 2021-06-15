export class GetBusRoutesDto {
  routes: {
    id: string;
    ptxName?: string;
    nameZhTw?: string;
    nameEn?: string;
    departureStopNameZhTw?: string;
    departureStopNameEn?: string;
    destinationStopNameZhTw?: string;
    destinationStopNameEn?: string;
    city?: string;
    subRoutes: {
      id: string;
      direction: number;
      stops: {
        id: string;
        sequence: number;
        nameZhTw?: string;
        nameEn?: string;
      }[];
    }[];
  }[];
}
