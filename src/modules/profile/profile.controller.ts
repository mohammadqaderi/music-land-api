import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from '../auth/dto/create-profile.dto';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { Roles } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enums/role.enum';
import { ProfileService } from './profile.service';


@UseGuards(AuthGuard(), AcceptedAuthGuard)
@Roles([Role.ADMIN, Role.USER])
@Controller('profiles')
export class ProfileController {

  constructor(private profileService: ProfileService) {
  }

  @Get('user-profile')
  getUserProfile(@GetAuthenticatedUser() user: User) {
    return this.profileService.getProfileData(user);
  }

  @Post('user-profile/set-profile-image')
  @UseInterceptors(FileInterceptor('image'))
  setProfileImage(@GetAuthenticatedUser() user: User, @UploadedFile() image: any) {
    return this.profileService.setProfileImage(user, image);
  }

  @Patch('user-profile/change-profile-image')
  @UseInterceptors(FileInterceptor('image'))
  changeProfileImage(@GetAuthenticatedUser() user: User, @UploadedFile() image: any) {
    return this.profileService.changeProfileImage(user, image);
  }

  @Put('user-profile/edit-profile')
  editProfile(@GetAuthenticatedUser() user: User, @Body() createProfileDto: CreateProfileDto) {
    return this.profileService.editProfile(user, createProfileDto);
  }

  @Delete('user-profile/delete-profile-image')
  deleteProfileImage(@GetAuthenticatedUser() user: User) {
    return this.profileService.deleteProfileImage(user);
  }

}
