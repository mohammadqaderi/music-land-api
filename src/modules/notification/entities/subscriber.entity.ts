import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Key } from '../classes/key';
import { User } from '../../auth/entities/user.entity';
import { SubscribersNotifications } from './subscribers-notifications.entity';

@Entity('subscribers')
export class Subscriber extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column({nullable: true})
  expirationTime: Date;

  @Column('simple-json')
  keys: Key;

  @OneToOne(type => User, user => user.subscriber, {
   eager: true
  })
  user: User;

  @OneToMany(type => SubscribersNotifications,
    subscribersNotifications => subscribersNotifications.subscriber, {
      eager: true,
    })
  subscribersNotifications: SubscribersNotifications[];


}
