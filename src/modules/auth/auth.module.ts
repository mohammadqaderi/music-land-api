import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { EmailVerification } from './entities/email-verification.entity';
import { JwtStrategy } from './stratigies/jwt-strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ForgottenPassword } from './entities/forgotten-password.entity';
import { ProfileModule } from '../profile/profile.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { ChatModule } from '../../shared/modules/chat/chat.module';
import { NotificationModule } from '../notification/notification.module';
import { GoogleStrategy } from './stratigies/google.strategy';
import { FacebookStrategy } from './stratigies/facebook.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: AuthConstants.secretKey,
      signOptions: {
        expiresIn: AuthConstants.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository, EmailVerification, ForgottenPassword]),
    ProfileModule,
    FavoriteModule,
    PlaylistModule,
    NotificationModule,
    forwardRef(() => ChatModule),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy, JwtModule, PassportModule],
})
export class AuthModule {
}
