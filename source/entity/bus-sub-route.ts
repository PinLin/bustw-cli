import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { BusRoute } from './bus-route';
import { BusStop } from './bus-stop';

@Entity()
export class BusSubRoute {
  @PrimaryColumn()
  id: string;

  @PrimaryColumn()
  direction: number

  @Column({ nullable: true })
  headsignZhTw: string;

  @Column({ nullable: true })
  headsignEn: string;

  @Column()
  stopsJson: string;

  @ManyToOne(_ => BusRoute, { onDelete: 'CASCADE' })
  route: BusRoute;
}
