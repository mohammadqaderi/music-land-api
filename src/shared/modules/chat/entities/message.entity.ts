import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from '../../../../modules/auth/entities/user.entity';


@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  created: Date;

  @Column()
  roomName: string;

  @Column()
  sender: string;

  @ManyToOne(type => Room, room => room.messages, {
    eager: false
  })
  room: Room;

  @ManyToOne(type => User, user => user.messages, {
    eager: false
  })
  user: User;

  // foreign key
  @Column()
  roomId: number;

  // foreign key
  @Column()
  userId: number;
}
