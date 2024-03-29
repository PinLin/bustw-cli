import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BusSubRoute } from './bus-sub-route';

@Entity()
export class BusRoute {
  @PrimaryColumn()
  id: string;

  @Column()
  ptxName?: string;

  @Column()
  nameZhTw?: string;

  @Column()
  nameEn?: string;

  @Column()
  departureStopNameZhTw?: string;

  @Column({ nullable: true })
  departureStopNameEn?: string;

  @Column()
  destinationStopNameZhTw?: string;

  @Column({ nullable: true })
  destinationStopNameEn?: string;

  @Column()
  city?: string;

  @OneToMany(_ => BusSubRoute, subRoute => subRoute.route)
  subRoutes: BusSubRoute[];
}
