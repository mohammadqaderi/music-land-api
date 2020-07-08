import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationData } from '../classes/notification-data';
import { Subscriber } from './subscriber.entity';
import {  NotificationEntity } from './notification.entity';

@Entity('subscribers-notifications')
export class SubscribersNotifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;


  // Optional
  @Column('simple-json')
  data: NotificationData;

  @Column({
    type: 'jsonb',
    array: false,
  })
  actions: Array<{ title: string, action: string }>;

  @Column('int', {
    array: true,
  })
  vibrate: Array<number>;

  @ManyToOne(type => Subscriber,
    subscriber => subscriber.subscribersNotifications, {
      eager: false,
    })
  subscriber: Subscriber;

  @ManyToOne(type => NotificationEntity,
    notification => notification.subscribersNotifications, {
      eager: false,
    })
  notification: NotificationEntity;


  // foreign keys
  @Column()
  subscriberId: number;

  @Column()
  notificationId: number;
}
