import { Injectable, NotFoundException } from '@nestjs/common';
import { Playlist } from './playlist.entity';
import { User } from '../auth/entities/user.entity';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistDto } from './dto/playlist.dto';
import { DeleteResult } from 'typeorm';
import { Song } from '../song/song.entity';
import { Music } from '../music/music.entity';
import { TrackService } from '../track/track.service';

@Injectable()
export class PlaylistService {

  constructor(private playlistRepository: PlaylistRepository,
              private trackService: TrackService) {
  }

  async getUserPlaylists(user: User): Promise<Playlist[]> {
    return await this.playlistRepository.getUserPlaylists(user.id);
  }

  async getPlaylistById(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: {
        id,
      },
    });
    if (!playlist) {
      throw new NotFoundException(`Playlist with Id ${id} Does not found`);
    }
    return playlist;
  }

  async newPlaylist(user: User, playlistDto: PlaylistDto): Promise<Playlist> {
    const { name } = playlistDto;
    const playlist = new Playlist();
    playlist.name = name;
    playlist.user = user; // this will create a foreign key called userId
    playlist.tracks = [];
    return await playlist.save();
  }

  async updatePlaylist(id: number, playlistDto: PlaylistDto): Promise<Playlist> {
    const { name } = playlistDto;
    const playlist = await this.getPlaylistById(id);
    if (name) {
      playlist.name = name;
    }
    return await playlist.save();
  }

  async deletePlaylist(id: number): Promise<DeleteResult> {
    await this.clearPlaylistContent(id);
    const result = await this.playlistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Playlist with Id ${id} Does not found`);
    }
    return result;
  }

  async clearPlaylistContent(id: number): Promise<Playlist>{
    const playlist = await this.getPlaylistById(id);
    for (let i = 0; i < playlist.tracks.length; i++) {
      await this.trackService.deleteTrack(playlist.tracks[i].id);
    }
    playlist.tracks = [];
    return await playlist.save();
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<Playlist>{
    const playlist = await this.getPlaylistById(playlistId);
    for (let i = 0; i < playlist.tracks.length; i++) {
      if(playlist.tracks[i].id === trackId){
        await this.trackService.deleteTrack(trackId);
        playlist.tracks.splice(i, 1);
        break;
      }
    }
    return await playlist.save();
  }
  async createPlaylistTrack(song: Song, music: Music, playlistId: number) {
    const playlist = await this.getPlaylistById(playlistId);
    const track = this.trackService.pushToPlaylist(song, music, playlist);
    return track;
  }
}
