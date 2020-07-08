import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { Repository } from 'typeorm';
import { Song } from '../song/song.entity';
import { Music } from '../music/music.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Playlist } from '../playlist/playlist.entity';


@Injectable()
export class TrackService {
  constructor(@InjectRepository(Track) private trackRepository: Repository<Track>) {
  }

  async pushToFavoriteList(song: Song, music: Music, favorite: Favorite) {
    let track = new Track();
    track = this.checkTrackType(track, song, music);
    track.favorite = favorite; // / creation of a foreign key called favoriteId
    return await track.save();
  }

  async pushToPlaylist(song: Song, music: Music, playlist: Playlist) {
    let track = new Track();
    track = this.checkTrackType(track, song, music);
    track.playlist = playlist; // creation of a foreign key called playlistId
    return await track.save();
  }

  async deleteTrack(id: number) {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Track with Id ${id} Does not found`);
    }
    return result;
  }

  checkTrackType(track: Track, song: Song, music: Music) {
    if (song) {
      track.song = song;
      track.title = song.name;
      track.link = song.source;
    } else if (music) {
      track.music = music;
      track.title = music.name;
      track.link = music.source;
    }
    return track;
  }
}
