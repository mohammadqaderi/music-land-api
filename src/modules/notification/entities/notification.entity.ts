import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubscribersNotifications } from './subscribers-notifications.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @OneToMany(type => SubscribersNotifications,
    subscribersNotifications => subscribersNotifications.notification, {
      eager: true,
    })
  subscribersNotifications: SubscribersNotifications[];
}
