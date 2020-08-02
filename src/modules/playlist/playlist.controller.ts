import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { PlaylistDto } from './dto/playlist.dto';
import { PlaylistService } from './playlist.service';

@UseGuards(AuthGuard(), UserAuthGuard)
@Roles([Role.USER])
@Controller('playlists')
export class PlaylistController {

  constructor(private playlistService: PlaylistService) {
  }

  @Get('user-playlists')
  getAllUserPlaylists(@GetAuthenticatedUser() user: User) {
    return this.playlistService.getUserPlaylists(user);
  }

  @Get(':id')
  getPlaylist(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.getPlaylistById(id);

  }

  @Post('new-playlist')
  newPlaylist(@GetAuthenticatedUser() user: User, @Body() playlistDto: PlaylistDto) {
    return this.playlistService.newPlaylist(user, playlistDto);
  }

  @Put(':id/update-playlist')
  updatePlaylist(@Param('id', ParseIntPipe) id: number, @Body() playlistDto: PlaylistDto) {
    return this.playlistService.updatePlaylist(id, playlistDto);

  }

  @Delete(':id/delete-playlist')
  deletePlaylist(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.deletePlaylist(id);
  }



  @Delete(':id/clear-playlist')
  clearPlaylistContent(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.clearPlaylistContent(id);
  }

  @Delete(':playlistId/remove-track-from-playlist/:trackId')
  removeTrackFromFavoriteList(@Param('playlistId', ParseIntPipe) playlistId: number,
                              @Param('trackId', ParseIntPipe) trackId: number) {
    return this.playlistService.removeTrackFromPlaylist(playlistId, trackId);

  }
}
