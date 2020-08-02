import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistType } from '../../commons/enums/artist-type.enum';
import { Gender } from '../../commons/enums/gender.enum';
import { CreateAlbumDto } from '../../shared/dto/create-album.dto';
import { MusicianService } from './musician.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';


@Controller('musicians')
export class MusicianController {
  constructor(private musicianService: MusicianService) {

  }

  //localhost:3000/musicians
  @Get()
  getAllMusicians() {
    return this.musicianService.getAllMusicians();
  }

  @Get('filtered')
  getFilteredMusicians(@Query('limit') limit: number,
                       @Query('type') type: ArtistType,
                       @Query('nationality') nationality: string,
                       @Query('gender') gender: Gender) {
    return this.musicianService.getFilteredMusicians(limit, nationality, type, gender);
  }

  @Get('limited')
  getLimitedMusicians(@Query('limit') limit: number) {
    return this.musicianService.getLimitedMusicians(limit);
  }


  //localhost:3000/musicians
  @Post()
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(FileInterceptor('image'))
  createNewMusician(@Body('name') name: string,
                    @Body('info') info: string,
                    @Body('gender') gender: Gender,
                    @Body('nationality') nationality: string,
                    @Body('type') type: ArtistType,
                    @UploadedFile() image: any) {
    return this.musicianService.createNewMusician(name, info, gender, type, nationality, image);
  }

  //localhost:3000/musicians/:id
  @Get(':id')
  getMusicianById(@Param('id', ParseIntPipe) id: number) {
    return this.musicianService.getMusicianById(id);
  }

  @Post(':id/new-album')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewAlbum(@Param('id', ParseIntPipe) id: number,
                 @Body() createAlbumDto: CreateAlbumDto) {

    return this.musicianService.createNewAlbum(id, createAlbumDto);
  }

  @Put(':id/update-musician')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(FileInterceptor('image'))
  updateMusician(@Param('id', ParseIntPipe) id: number,
               @Body('name') name: string,
               @Body('info') info: string,
               @Body('gender') gender: Gender,
               @Body('nationality') nationality: string,
               @Body('type') type: ArtistType,
               @UploadedFile() image: any) {
    return this.musicianService.updateMusician(id, name, info, gender, nationality, type, image);
  }

  @Delete(':id/delete-musician')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  deleteMusician(@Param('id', ParseIntPipe) id: number) {
    return this.musicianService.deleteMusician(id);
  }

}
