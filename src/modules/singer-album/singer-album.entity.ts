import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractAlbum } from '../../commons/classes/abstract-album';
import { Singer } from '../singer/singer.entity';
import { Song } from '../song/song.entity';


@Entity('singer-albums')
@Unique(['name'])
export class SingerAlbum extends AbstractAlbum {
  @ManyToOne(type => Singer, singer => singer.singerAlbums, {
    eager: false
  })
  singer: Singer;

  @OneToMany(type => Song, song => song.singerAlbum, {
    eager: true
  })
  songs: Song[];

  //Foreign Key
  @Column()
  singerId: number;
}
