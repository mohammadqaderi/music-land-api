import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';
import { UserJoinedRoom } from './user-joined-room.entity';


@Entity('rooms')
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: new Date(),
  })
  createdAt: Date;

  @Column()
  createdBy: string;

  @OneToMany(type => Message, message => message.room, {
    eager: true
  })
  messages: Message[];

  @OneToMany(type => UserJoinedRoom,
      userJoinedRoom => userJoinedRoom.room, {
    eager: true
  })
  userJoinedRooms: UserJoinedRoom[];
}
