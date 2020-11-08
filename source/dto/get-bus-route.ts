export class GetBusRoutesDto {
  routes: {
    id: string;
    nameZhTw?: string;
    nameEn?: string;
    departureStopNameZhTw?: string;
    departureStopNameEn?: string;
    destinationStopNameZhTw?: string;
    destinationStopNameEn?: string;
    city?: string;
    subRoutes: {
      id: string;
      direction: number
      nameZhTw?: string;
      nameEn?: string;
      stops: {
        id: string;
        sequence: number;
        nameZhTw?: string;
        nameEn?: string;
      }[];
    }[];
  }[];
}
