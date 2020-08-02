import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { Repository } from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { TrackService } from '../track/track.service';
import { Music } from '../music/music.entity';
import { Song } from '../song/song.entity';


@Injectable()
export class FavoriteService {
  constructor(@InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>,
              private trackService: TrackService) {
  }

  async getUserFavoriteList(id: number, profile?: Profile): Promise<Favorite> {
    let favoriteList = null;
    if (id) {
      favoriteList = await this.favoriteRepository.findOne({
        where: {
          id,
        },
      });
    } else if (profile) {
      favoriteList = await this.favoriteRepository.findOne({ profile });
    } else {
      throw new NotFoundException('Favorite list does not found');
    }
    return favoriteList;
  }

  async deleteFavoriteList(id: number): Promise<void> {
    await this.clearFavoriteListContent(id);
    const result = await this.favoriteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('favorite list does not found');
    }
  }

  async clearFavoriteListContent(id: number): Promise<Favorite> {
    const favorite = await this.getUserFavoriteList(id);
    for (let i = 0; i < favorite.tracks.length; i++) {
      await this.trackService.deleteTrack(favorite.tracks[i].id);
    }
    favorite.tracks = [];
    return await favorite.save();
  }

  async removeTrackFromFavouriteList(favouriteId: number, trackId: number): Promise<void> {
    const favorite = await this.getUserFavoriteList(favouriteId);
    for (let i = 0; i < favorite.tracks.length; i++) {
      if (trackId === favorite.tracks[i].id) {
        await this.trackService.deleteTrack(
          trackId,
        );
        break;
      }
    }
  }

  async createFavoriteTrack(song: Song, music: Music, favoriteListId: number) {
    const favorite = await this.getUserFavoriteList(favoriteListId);
    const track = this.trackService.pushToFavoriteList(song, music, favorite);
    return track;
  }
}
