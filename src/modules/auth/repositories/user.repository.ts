import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '../../../commons/enums/role.enum';
import { EmailLoginDto } from '../dto/email-login.dto';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.findOne({ username });
  }

  async validateUserPassword(emailLoginDto: EmailLoginDto): Promise<{ email: string, user: User }> {
    const { email, password } = emailLoginDto;
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exist in the database');
    }
    // check if the user has account from social envoiroments like google and facebook.
    if (!user.password) {
      const errMessage = `You Cannot login from this gate, it's only for the main users,
      use the google or facebook gateways to login`;
      throw new ConflictException(errMessage, errMessage);
    }
    if ((await user.validatePassword(password))) {
      return { email, user };
    } else {
      throw new BadRequestException('Your Password in incorrect, please enter another one');
    }
  }

  async validateAdminPassword(emailLoginDto: EmailLoginDto) {
    const { email, password } = emailLoginDto;
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exist in the database');
    }
    const isAdmin = (): boolean => user.roles.some(role => role === Role.ADMIN);
    if (!isAdmin()) {
      throw new ForbiddenException('This Resource Is Forbidden');
    }
    if (user && (await user.validatePassword(password))) {
      return { email, user };
    } else {
      throw new BadRequestException('Your Password in incorrect, please enter another one');
    }
  }

  async hashPassword(password, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
