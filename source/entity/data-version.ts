import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DataVersion {
  @PrimaryColumn()
  city: string;

  @Column()
  versionId: number;
}
