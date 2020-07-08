import { BaseEntity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Gender } from '../enums/gender.enum';
import { ArtistType } from '../enums/artist-type.enum';
export abstract class AbstractArtist extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  info: string;

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: ArtistType,
    array: false
  })
  type: ArtistType;

  @Column({
    nullable: true
  })
  gender: Gender;

  @Column()
  nationality: string;

}
