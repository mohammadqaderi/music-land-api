import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractAlbum extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;


}
