import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractMusic extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  artist: string;

  @Column({
    default: 0
  })
  rate: number;

  @Column()
  source: string;

  @Column({
    default: new Date()
  })
  publishedIn: Date;

  @Column()
  tempImage: string;
}
