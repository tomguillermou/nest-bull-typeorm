import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MetricEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column()
  timestamp: Date;
}
