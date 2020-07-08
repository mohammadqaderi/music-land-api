import { Entity, OneToMany, Unique } from 'typeorm';
import { AbstractArtist } from '../../commons/classes/abstract-artist';
import { MusicianAlbum } from '../musician-album/musician-album.entity';

@Entity('musicians')
export class Musician extends AbstractArtist{
  @OneToMany(type => MusicianAlbum,
      musicianAlbum => musicianAlbum.musician, {
    eager: true
  })
  musicianAlbums: MusicianAlbum[];
}
