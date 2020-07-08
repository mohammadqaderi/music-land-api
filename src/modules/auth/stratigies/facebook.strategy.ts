import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { config } from '../../../config';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private userRepository: UserRepository, private authService: AuthService) {
    super({
      clientID: config.oAuthFacebook.FACEBOOK_CLIENT_ID,
      clientSecret: config.oAuthFacebook.FACEBOOK_SECRET_ID,
      callbackURL: config.oAuthFacebook.CALL_BACK_URI,
      scope: config.oAuthFacebook.SCOPE,
      profileFields: ['id', 'displayName', 'email', 'photos', 'name']
    });
  }

  async validate(accessToken: string,
                 refreshToken: string, profile: any, done: any){
    // check if the user exist on the database or not
    const {id} = profile;
    let user = await this.userRepository.findOne({
      where: {
        facebookId: id,
      },
    });
    if (user) {
      const { emails } = profile;
      const jwt = this.authService.generateJwtToken(emails[0].value);
      done(null, { user, jwt });
    } else {
      console.log(profile);
      const { facebookUser, jwt } = await this.authService.SingInFacebook(profile, id);
      done(null, { facebookUser, jwt });
    }
  }

}