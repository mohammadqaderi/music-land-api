import { EntityRepository, Repository } from 'typeorm';
import { Song } from './song.entity';
import { SongType } from '../../commons/enums/song-type.enum';
import { SongLanguage } from '../../commons/enums/song-language.enum';

@EntityRepository(Song)
export class SongRepository extends Repository<Song>{

  async getLimitedSongs(limit: number): Promise<Song[]>{
    const query = this.createQueryBuilder('song').select();
    if(limit){
      query.limit(limit);
    }
    const songs = await query.leftJoinAndSelect('song.tracks', 'track').getMany();
    return songs;
  }

  async getFilteredSongs(limit: number, type: SongType, language: SongLanguage, rate: number): Promise<Song[]>{
    const query = this.createQueryBuilder('song').select();
    if(limit){
      query.limit(limit);
    }
    if(type){
      query.where('song.type = :type', {type});
    }
    if(language){
      query.andWhere('song.language = :language', {language});
    }
    if(rate){
      query.andWhere('song.rate = :rate', {rate});
    }
    const songs = await query.leftJoinAndSelect('song.tracks', 'track').getMany();
    return songs;
  }
}
