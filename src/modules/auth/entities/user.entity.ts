import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../../../commons/enums/role.enum';
import * as bcrypt from 'bcryptjs';
import { Profile } from '../../profile/profile.entity';
import { Playlist } from '../../playlist/playlist.entity';
import { Message } from '../../../shared/modules/chat/entities/message.entity';
import { UserJoinedRoom } from '../../../shared/modules/chat/entities/user-joined-room.entity';
import { Subscriber } from '../../notification/entities/subscriber.entity';
import { Auth } from '../../../commons/classes/auth';

@Entity('users')
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  salt: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
  })
  roles: Role[];


  // new column
  @Column({
    default: false,
  })
  isEmailVerified: boolean;


  //  new column
  // this column is related to the functionality of signIn with facebook
  @Column({
    nullable: true,
  })
  googleId: string;

  //  new column
  // this column is related to the functionality of signIn with facebook
  @Column({
    nullable: true,
  })
  facebookId: string;



  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  @OneToOne(type => Profile, profile => profile.user)
  @JoinColumn()
  profile: Profile;

  @OneToOne(type => Subscriber, subscriber => subscriber.user)
  @JoinColumn()
  subscriber: Subscriber;

  @OneToMany(type => Playlist, playlist => playlist.user, {
    eager: true,
  })
  playlists: Playlist[];

  @OneToMany(type => Message, message => message.user, {
    eager: true,
  })
  messages: Message[];

  @OneToMany(type => UserJoinedRoom,
    userJoinedRoom => userJoinedRoom.user, {
      eager: true,
    })
  userJoinedRooms: UserJoinedRoom[];

  // Foreign Key
  @Column()
  profileId: number;

  // Foreign Key
  @Column({
    nullable: true,
  })
  subscriberId: number;


  // this column related to socket io
  @Column({
    nullable: true,
  })
  clientId: string;
}
