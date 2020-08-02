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
import { SingerService } from './singer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
@Controller('singers')
export class SingerController {

  constructor(private singerService: SingerService) {
  }

  //localhost:3000/singers
  @Get()
  getAllSingers() {
    return this.singerService.getAllSingers();
  }

  @Get('filtered')
  getFilteredSingers(@Query('limit') limit: number,
                     @Query('type') type: ArtistType,
                     @Query('nationality') nationality: string,
                     @Query('gender') gender: Gender) {

    return this.singerService.getFilteredSingers(limit, nationality, type, gender);
  }

  @Get('limited')
  getLimitedSingers(@Query('limit') limit: number) {
    return this.singerService.getLimitedSingers(limit);
  }


  //localhost:3000/singers
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewSinger(@Body('name') name: string,
                  @Body('info') info: string,
                  @Body('gender') gender: Gender,
                  @Body('nationality') nationality: string,
                  @Body('type') type: ArtistType,
                  @UploadedFile() image: any) {
    return this.singerService.createNewSinger(name, info, gender, type, nationality, image);
  }

  //localhost:3000/singers/:id
  @Get(':id')
  getSingerById(@Param('id', ParseIntPipe) id: number) {
    return this.singerService.getSingerById(id);
  }

  @Post(':id/new-album')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewAlbum(@Param('id', ParseIntPipe) id: number,
                 @Body() createAlbumDto: CreateAlbumDto) {

    return this.singerService.createNewAlbum(id, createAlbumDto);
  }

  @Put(':id/update-singer')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(FileInterceptor('image'))
  updateSinger(@Param('id', ParseIntPipe) id: number,
               @Body('name') name: string,
               @Body('info') info: string,
               @Body('gender') gender: Gender,
               @Body('nationality') nationality: string,
               @Body('type') type: ArtistType,
               @UploadedFile() image: any) {
    return this.singerService.updateSinger(id, name, info, gender, nationality, type, image);
  }

  @Delete(':id/delete-singer')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  deleteSinger(@Param('id', ParseIntPipe) id: number) {
    return this.singerService.deleteSinger(id);
  }

}
