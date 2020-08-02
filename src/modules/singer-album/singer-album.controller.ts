import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAlbumDto } from '../../shared/dto/create-album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongType } from '../../commons/enums/song-type.enum';
import { SongLanguage } from '../../commons/enums/song-language.enum';
import { SingerAlbumService } from './singer-album.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';

@Controller('singers-albums')
export class SingerAlbumController {

  constructor(private singerAlbumService: SingerAlbumService) {
  }

  @Get()
  getAllSingerAlbums() {
    return this.singerAlbumService.getAllSingerAlbums();
  }

  @Get(':id')
  getSingerAlbum(@Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.getSingerAlbumById(id);
  }

  @Post(':id/new-song')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(FileInterceptor('source'))
  createNewSong(@Param('id', ParseIntPipe) id: number,
                @Body('name') name: string,
                @Body('description') description: string,
                @Body('artist') artist: string,
                @Body('type') type: SongType,
                @Body('language') language: SongLanguage,
                @UploadedFile() source: any,
  ) {
    return this.singerAlbumService.createNewSong(id, name, description, artist, type, language, source);
  }

  @Put(':id/update-album')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  updateAlbum(@Param('id', ParseIntPipe) id: number, @Body() createAlbumDto: CreateAlbumDto) {
    return this.singerAlbumService.updateSingerAlbum(id, createAlbumDto);
  }

  @Delete(':id/delete-album')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  deleteAlbum(@Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.deleteSingerAlbum(id);
  }


  @Delete(':id/clear-singer-album')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  clearSingerAlbum(@Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.clearSingerAlbum(id);
  }
}
