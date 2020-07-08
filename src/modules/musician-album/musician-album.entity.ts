import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractAlbum } from '../../commons/classes/abstract-album';
import { Musician } from '../musician/musician.entity';
import { Music } from '../music/music.entity';
@Entity('musician-albums')
@Unique(['name'])
export class MusicianAlbum extends AbstractAlbum{

  @ManyToOne(type => Musician, musician => musician.musicianAlbums, {
    eager: false
  })
  musician: Musician;

  //Foreign Key
  @Column()
  musicianId: number;

  @OneToMany(type => Music, music => music.musicianAlbum, {
    eager: true
  })
  musics: Music[];
}
