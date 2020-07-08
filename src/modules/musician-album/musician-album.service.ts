import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AwsService } from '../../shared/modules/aws/aws.service';
import { CreateAlbumDto } from '../../shared/dto/create-album.dto';
import { MusicianAlbum } from './musician-album.entity';
import { MusicType } from '../../commons/enums/music-type.enum';
import { Music } from '../music/music.entity';
import { MusicService } from '../music/music.service';

@Injectable()
export class MusicianAlbumService {

  constructor(@InjectRepository(MusicianAlbum) private musicianAlbumRepository: Repository<MusicianAlbum>,
              private awsService: AwsService,
              private musicService: MusicService) {
  }

  async getAllMusicianAlbums(): Promise<MusicianAlbum[]> {
    return await this.musicianAlbumRepository.find();
  }

  async getMusicianAlbumById(id: number): Promise<MusicianAlbum> {
    const musicianAlbum = await this.musicianAlbumRepository.findOne({
      where: {
        id,
      },
    });
    if (!musicianAlbum) {
      throw new NotFoundException(`Musician Album Album with id ${id} does not found`);
    }
    return musicianAlbum;
  }

  async createNewMusic(musicianAlbumId: number, name: string,
                      description: string,
                      artist: string,
                      type: MusicType,
                      source: any,
  ): Promise<Music> {
    const music = new Music();
    const musicianAlbum = await this.getMusicianAlbumById(musicianAlbumId);
    music.name = name;
    music.description = description;
    music.artist = artist;
    music.type = type;
    music.tempImage = musicianAlbum.image;
    music.source = await this.awsService.fileUpload(source, 'musics');
    music.musicianAlbum = musicianAlbum;
    const savedMusic = await music.save();
    return savedMusic;
  }

  async updateMusicianAlbum(id: number, createAlbumDto: CreateAlbumDto): Promise<MusicianAlbum> {
    const musicianAlbum = await this.getMusicianAlbumById(id);
    const { name } = createAlbumDto;
    if (name) {
      musicianAlbum.name = name;
    }
    const savedMusicianAlbum = await musicianAlbum.save();
    return savedMusicianAlbum;
  }

  async deleteMusicianAlbum(id: number): Promise<DeleteResult>{
    const musicianAlbum = await this.getMusicianAlbumById(id);
    for (let i = 0; i < musicianAlbum.musics.length; i++) {
      await this.musicService.deleteMusic(musicianAlbum.musics[i].id);
    }
    const result = await this.musicianAlbumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Musician Album with id ${id} does not found`);
    }
    return result;
  }
}
