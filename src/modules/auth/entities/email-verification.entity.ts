import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('verified-emails')
@Unique(['email', 'emailToken'])
export class EmailVerification extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  emailToken: string;

  @Column()
  timestamp: Date;
}
