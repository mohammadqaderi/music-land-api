import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseIntPipe
} from '@nestjs/common';
import { SongLanguage } from '../../commons/enums/song-language.enum';
import { SongType } from '../../commons/enums/song-type.enum';
import { SongService } from './song.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';

@Controller('songs')
export class SongController {

  constructor(private songService: SongService) {

  }

  @Get()
  getAllSongs() {
    return this.songService.getAllSongs();
  }

  @Get('limited')
  getLimitedSongs(@Query('limit') limit: number) {
    return this.songService.getLimitedSongs(limit);
  }

  @Get('filtered')
  getFilteredSongs(@Query('limit') limit: number,
                   @Query('type') type: SongType,
                   @Query('language') language: SongLanguage,
                   @Query('rate') rate: number) {
    return this.songService.getFilteredSong(limit, type, language, rate);
  }

  @Get(':id')
  getSongById(@Param('id') id: number) {
    return this.songService.getSongById(id);
  }



  @Put(':id/update-song')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(FileInterceptor('source'))
  updateSong(@Param('id') id: number,
             @Body('name') name: string,
             @Body('description') description: string,
             @Body('artist') artist: string,
             @Body('type') type: SongType,
             @Body('language') language: SongLanguage,
             @UploadedFile() source: any,
  ) {
    return this.songService.updateSong(id, name, description, artist, type, language, source);
  }

  @Delete(':id/delete-song')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id') id: number) {
    return this.songService.deleteSong(id);
  }

  @Post(':songId/add-to-playlist/:playlistId')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles([Role.USER])
  addToPlaylist(@Param('songId') songId: number,
                @Param('playlistId') playlistId: number) {
    return this.songService.pushToPlaylist(songId, playlistId);
  }

  @Post(':songId/save-to-favorite-list/:favoriteId')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles([Role.USER])
  saveToFavoriteList(@Param('songId') songId: number,
                     @Param('favoriteId') favoriteId: number) {
    return this.songService.pushToFavoriteList(songId, favoriteId);
  }
}
