import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRepository } from './music.repository';
import { MusicController } from './music.controller';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { MusicService } from './music.service';
import { FavoriteModule } from '../favorite/favorite.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [TypeOrmModule.forFeature([MusicRepository]),
    forwardRef(() => PlaylistModule), AwsModule, FavoriteModule,
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }), TrackModule],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {
}
