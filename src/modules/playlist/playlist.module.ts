import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { PlaylistRepository } from './playlist.repository';
import { TrackModule } from '../track/track.module';


@Module({
  imports: [TypeOrmModule.forFeature([PlaylistRepository]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), TrackModule
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {
}
