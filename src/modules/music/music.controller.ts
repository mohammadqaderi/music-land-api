import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseArrayPipe, ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MusicType } from '../../commons/enums/music-type.enum';
import { MusicService } from './music.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';

@Controller('musics')
export class MusicController {
  constructor(private musicService: MusicService) {

  }

  @Get()
  getAllMusics() {
    return this.musicService.getAllMusics();
  }

  @Get('limited')
  getLimitedMusics(@Query('limit') limit: number) {
    return this.musicService.getLimitedMusics(limit);
  }

  @Get('filtered')
  getFilteredMusics(@Query('limit') limit: number,
                    @Query('type') type: MusicType,
                    @Query('rate') rate: number) {
    return this.musicService.getFilteredMusics(limit, type, rate);
  }



  @Get(':id')
  private getMusicById(@Param('id') id: number) {
    return this.musicService.getMusicById(id);
  }

  
 

  @Put(':id/update-music')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(FileInterceptor('source'))
  updateMusic(@Param('id') id: number,
              @Body('name') name: string,
              @Body('description') description: string,
              @Body('artist') artist: string,
              @Body('type') type: MusicType,
              @UploadedFile() source: any) {
    return this.musicService.updateMusic(id, name, description, artist, type, source);
  }

  @Delete(':id/delete-music')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id') id: number) {
    return this.musicService.deleteMusic(id);
  }

  @Post(':musicId/add-to-playlist/:playlistId')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles([Role.USER])
  addToPlaylist(@Param('musicId') musicId: number,
                @Param('playlistId') playlistId: number) {
    return this.musicService.pushToPlaylist(musicId, playlistId);
  }

  @Post(':musicId/save-to-favorite-list/:favoriteId')
  @UseGuards(AuthGuard(), UserAuthGuard)
  @Roles([Role.USER])
  saveToFavoriteList(@Param('musicId', ParseIntPipe) musicId: number,
                     @Param('favoriteId', ParseIntPipe) favoriteId: number) {
    return this.musicService.pushToFavoriteList(musicId, favoriteId);
  }
}
