import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAlbumDto } from '../../shared/dto/create-album.dto';
import { MusicianAlbumService } from './musician-album.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicType } from '../../commons/enums/music-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';

@Controller('musicians-albums')
export class MusicianAlbumController {
  constructor(private musicianAlbumService: MusicianAlbumService){}
  @Get()
  getAllMusicianAlbums() {
    return this.musicianAlbumService.getAllMusicianAlbums();
  }

  @Get(':id')
  getMusicianAlbum(@Param('id') id: number) {
    return this.musicianAlbumService.getMusicianAlbumById(id);
  }

  @Post(':id/new-music')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(FileInterceptor('source'))
  createNewMusic(@Param('id') id: number,
              @Body('name') name: string,
              @Body('description') description: string,
              @Body('artist') artist: string,
              @Body('type') type: MusicType,
              @UploadedFile() source: any) {
    return this.musicianAlbumService.createNewMusic(id, name, description, artist, type, source);
  }

  @Put(':id/update-album')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  updateAlbum(@Param('id') id: number, @Body() createAlbumDto: CreateAlbumDto){
   return this.musicianAlbumService.updateMusicianAlbum(id, createAlbumDto);
  }

  @Delete(':id/delete-album')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  deleteAlbum(@Param('id') id: number){
    return this.musicianAlbumService.deleteMusicianAlbum(id);
  }
}
