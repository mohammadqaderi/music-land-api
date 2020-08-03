import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MusicianModule } from './modules/musician/musician.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { SongModule } from './modules/song/song.module';
import { MusicModule } from './modules/music/music.module';
import { MusicianAlbumModule } from './modules/musician-album/musician-album.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SingerModule } from './modules/singer/singer.module';
import { SingerAlbumModule } from './modules/singer-album/singer-album.module';
import { TrackModule } from './modules/track/track.module';
import { AwsModule } from './shared/modules/aws/aws.module';
import { MulterModule } from '@nestjs/platform-express';
import { NodemailerDrivers, NodemailerModule, NodemailerOptions } from '@crowdlinker/nestjs-mailer';
import { ChatModule } from './shared/modules/chat/chat.module';
import { AppController } from './app.controller';

@Module({
  imports: [TypeOrmModule.forRoot(config.db as TypeOrmModuleOptions),
    MulterModule.register({
      dest: './files',
    }),
    NodemailerModule.forRoot(
      {
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'mqaderi44@gmail.com',
            pass: '12345678asd',
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      } as NodemailerOptions<NodemailerDrivers.SMTP>),
    AuthModule,
    ChatModule,
    ProfileModule,
    SingerModule,
    MusicianModule,
    FavoriteModule,
    PlaylistModule,
    SongModule,
    MusicModule,
    SingerAlbumModule,
    MusicianAlbumModule,
    TrackModule,
    NotificationModule,
    AwsModule,
  ],
  controllers: [AppController],
})
export class AppModule {
}
