import { Gender } from '../../../commons/enums/gender.enum';

export class CreateProfileDto {

  firstName: string;

  lastName: string;

  age: number;

  phone: string;

  gender: Gender;

  country: string;

  city: string;

  address: string;
}
