import { EntityRepository, Repository } from 'typeorm';
import { Singer } from './singer.entity';
import { ArtistType } from '../../commons/enums/artist-type.enum';
import { Gender } from '../../commons/enums/gender.enum';


// this is a provider
@EntityRepository(Singer)
export class SingerRepository extends Repository<Singer> {
  async getLimitedSingers(limit: number): Promise<Singer[]> {
    const query = this.createQueryBuilder('singer').select();
    if (limit) {
      query.limit(limit);
    }
    const singers = await query.leftJoinAndSelect('singer.singerAlbums', 'singer-album').getMany();
    return singers;
  }

  async getFilteredSingers(limit: number, nationality: string, type: ArtistType,
                           gender: Gender): Promise<Singer[]> {
    const query = this.createQueryBuilder('singer').select();
    if (limit) {
      query.limit(limit);
    }
    if (nationality) {
      query.where('singer.nationality LIKE :nationality', {nationality});
    }
    if (type) {
      query.andWhere('singer.type = :type', {type});
    }
    if (gender) {
      query.andWhere('singer.gender = :gender', {gender});
    }
    const singers = await query.leftJoinAndSelect('singer.singerAlbums', 'singer-albums').getMany();
    return singers;
  }
}
