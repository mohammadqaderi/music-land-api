import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';


@UseGuards(AuthGuard(), UserAuthGuard)
@Roles([Role.USER])
@Controller('favorite-lists')
export class FavoriteController {
  constructor(private favoriteListService: FavoriteService) {
  }

  @Get(':id')
  getUserFavoriteList(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteListService.getUserFavoriteList(id);
  }

  /*
  the following endpoints related to the interaction between the favorite entity
  and music, song entities
  * */

  @Delete(':id/clear-favorite-list')
  clearFavoriteList(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteListService.clearFavoriteListContent(id);
  }

  @Delete(':favoriteId/remove-track-from-favorite-list/:trackId')
  removeTrackFromFavoriteList(@Param('favoriteId', ParseIntPipe) favoriteId: number,
                              @Param('trackId', ParseIntPipe) trackId: number) {
    return this.favoriteListService.removeTrackFromFavouriteList(favoriteId, trackId);
  }
}
