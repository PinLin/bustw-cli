import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class BusInfo {
  @PrimaryColumn()
  city: string;

  @Column()
  routesVersion: number;
}
