import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('forgotten-passwords')
@Unique(['email', 'newPasswordToken'])
export class ForgottenPassword extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  newPasswordToken: string;

  @Column()
  timestamp: Date;
}
