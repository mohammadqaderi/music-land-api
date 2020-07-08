import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateProfileDto } from '../auth/dto/create-profile.dto';
import { AwsService } from '../../shared/modules/aws/aws.service';


@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>,
              private awsService: AwsService) {
  }

  async getProfileData(user: User): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        id: user.profileId,
      },
    });
    if (!profile) {
      throw new NotFoundException('profile does not found');
    }
    return profile;
  }

  async deleteProfile(id: number): Promise<void> {
    const result = await this.profileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('profile does not found');
    }
  }

  async editProfile(user: User, createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = await this.getProfileData(user);
    const { firstName, lastName, phone, age, address, city, country, gender }
      = createProfileDto;
    if (firstName) {
      profile.firstName = firstName;
    }
    if (lastName) {
      profile.lastName = lastName;
    }
    if (phone) {
      profile.phone = phone;
    }
    if (age) {
      profile.age = age;
    }
    if (address) {
      profile.address = address;
    }
    if (city) {
      profile.city = city;
    }
    if (country) {
      profile.country = country;
    }
    if (firstName) {
      profile.gender = gender;
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }

  async setProfileImage(user: User, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (image) {
      profile.image = await this.awsService.fileUpload(image, 'profile-images');
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }

  async changeProfileImage(user: User, image: any): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (image) {
      await this.awsService.fileDelete(profile.image);
      profile.image = await this.awsService.fileUpload(image, 'profile-images');
    }
    const savedProfile = await profile.save();
    return savedProfile;
  }

  async deleteProfileImage(user: User): Promise<Profile> {
    const profile = await this.getProfileData(user);
    if (!profile.image) {
      throw new ConflictException('the profile is already set to null!');
    }
    await this.awsService.fileDelete(profile.image);
    profile.image = null;
    const savedProfile = await profile.save();
    return savedProfile;
  }
}
