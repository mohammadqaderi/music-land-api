import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongRepository } from './song.repository';
import { Song } from './song.entity';
import { SongType } from '../../commons/enums/song-type.enum';
import { SongLanguage } from '../../commons/enums/song-language.enum';
import { AwsService } from '../../shared/modules/aws/aws.service';
import { DeleteResult } from 'typeorm';
import { FavoriteService } from '../favorite/favorite.service';
import { Track } from '../track/track.entity';
import { PlaylistService } from '../playlist/playlist.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class SongService {
  constructor(@InjectRepository(SongRepository) private songRepository: SongRepository,
              private awsService: AwsService,
              private favService: FavoriteService,
              private playlistService: PlaylistService,
              private trackService: TrackService) {
  }

  async getAllSongs(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  async getSongById(id: number): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },
    });
    if (!song) {
      throw new NotFoundException(`Song with id ${id} does not found`);
    }
    return song;
  }

  async getFilteredSong(limit: number,
                        type: SongType, language: SongLanguage, rate: number): Promise<Song[]> {
    return await this.songRepository.getFilteredSongs(limit, type, language, rate);
  }

  async getLimitedSongs(limit: number): Promise<Song[]> {
    return await this.songRepository.getLimitedSongs(limit);
  }

  async updateSong(id: number, name: string, description: string,
                   artist: string, type: SongType, language: SongLanguage, source: any): Promise<Song> {
    const song = await this.getSongById(id);
    if (name) {
      song.name = name;
    }
    if (description) {
      song.description = description;
    }
    if (artist) {
      song.artist = artist;
    }
    if (type) {
      song.type = type;
    }
    if (language) {
      song.language = language;
    }
    if (source) {
      await this.awsService.fileDelete(song.source);
      song.source = await this.awsService.fileUpload(source, 'songs');
    }
    const updatedSong = await song.save();
    return updatedSong;
  }

  async deleteSong(id: number): Promise<DeleteResult> {
    const song = await this.getSongById(id);
    for (let i = 0; i < song.tracks.length; i++) {
      await this.trackService.deleteTrack(song.tracks[i].id);
    }
    if (song.source) {
      await this.awsService.fileDelete(song.source);
    }
    const result = await this.songRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Song with id ${id} does not found`);
    }
    return result;
  }

  async pushToFavoriteList(songId: number, favoriteListId: number): Promise<Track> {
    const song = await this.getSongById(songId);
    const track = await this.favService.createFavoriteTrack(song, null, favoriteListId);
    return track;
  }

  async pushToPlaylist(songId: number, playlistId: number): Promise<Track> {
    const song = await this.getSongById(songId);
    const track = await this.playlistService.createPlaylistTrack(song, null, playlistId);
    return track;
  }


}
