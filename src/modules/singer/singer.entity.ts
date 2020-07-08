import { Entity, OneToMany, Unique } from 'typeorm';
import { AbstractArtist } from '../../commons/classes/abstract-artist';
import { SingerAlbum } from '../singer-album/singer-album.entity';

@Entity('singers')
@Unique(['name'])
export class Singer extends AbstractArtist {
  @OneToMany(type => SingerAlbum,
    singerAlbum => singerAlbum.singer, {
      eager: true,
    })
  singerAlbums: SingerAlbum[];
}
