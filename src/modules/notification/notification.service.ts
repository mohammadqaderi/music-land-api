import { Injectable, NotFoundException } from '@nestjs/common';
import * as webPush from 'web-push';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Repository } from 'typeorm';
import { SubscribersNotifications } from './entities/subscribers-notifications.entity';
import { User } from '../auth/entities/user.entity';
import { NotificationPayloadDto } from './notification-payload.dto';
import { NotificationPayload } from './classes/notification-payload';
import { Notification } from './classes/notification';
import { NotificationData } from './classes/notification-data';
import { NotificationEntity } from './entities/notification.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Subscriber) private subscriberRepository: Repository<Subscriber>,
              @InjectRepository(SubscribersNotifications)
              private subscribersNotificationsRepository: Repository<SubscribersNotifications>) {
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return await this.subscriberRepository.find();
  }

  async getSubscriberById(id: number): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({
      where: {
        id,
      },
    });
    if (!subscriber) {
      throw new NotFoundException(`Subscriber with Id ${id} does not found`);
    }
    return subscriber;
  }

  async deleteSubscriber(id: number): Promise<void> {
    const subscriber = await this.getSubscriberById(id);
    for (let i = 0; i < subscriber.subscribersNotifications.length; i++) {
      await this.subscribersNotificationsRepository
        .delete(subscriber.subscribersNotifications[i].id);
    }
    const result = await this.subscriberRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscriber with Id ${id} does not found`);
    }
  }

  async newSubscriber(user: User, sub: any): Promise<Subscriber> {
    const { endpoint, expirationTime, keys } = sub;
    const subscriber = new Subscriber();
    subscriber.user = user;
    subscriber.keys = keys;
    subscriber.endpoint = endpoint;
    subscriber.expirationTime = expirationTime;
    subscriber.subscribersNotifications = [];
    return await subscriber.save();
  }


  async sendNewNotification(notificationPayloadDto: NotificationPayloadDto): Promise<void> {
    const { title, body } = notificationPayloadDto;
    const notificationPayload = new NotificationPayload();
    notificationPayload.notification = new Notification();
    notificationPayload.notification.title = title;
    notificationPayload.notification.body = body;
    notificationPayload.notification.actions = [
      {
        action: 'explore',
        title: 'explore my new website',
      },
      {
        action: 'explore',
        title: 'Close Popups',
      },
    ];
    notificationPayload.notification.data = new NotificationData();
    notificationPayload.notification.data.dateOfArrival = new Date(Date.now());
    notificationPayload.notification.data.primaryKey = uuidv4();
    notificationPayload.notification.icon =
      'https://songs-static.s3.us-east-2.amazonaws.com/main-page-logo-small-hat.png';
    notificationPayload.notification.vibrate = [100, 50, 100];
    const subscribers = await this.getAllSubscribers();
    const notification = await this.createNotification(title, body);
    for (let i = 0; i < subscribers.length; i++) {
      await this.createSubscriberNotification(
        notificationPayload,notification,subscribers[i]
      );
      await webPush.sendNotification(subscribers[i], JSON.stringify(notificationPayload));
    }

  }

  async createSubscriberNotification(notificationPayload: NotificationPayload,
                                     notification: NotificationEntity,
                                     subscriber: Subscriber): Promise<void> {
    const subscribeNotification = new SubscribersNotifications();
    subscribeNotification.title = notificationPayload.notification.title;
    subscribeNotification.body = notificationPayload.notification.body;
    subscribeNotification.data = notificationPayload.notification.data;
    subscribeNotification.actions = notificationPayload.notification.actions;
    subscribeNotification.vibrate = notificationPayload.notification.vibrate;

    //creation of foreign keys
    subscribeNotification.subscriber = subscriber;
    subscribeNotification.notification = notification;
    await subscribeNotification.save();

  }


  async createNotification(title: string, body: string) {
    const notification = new NotificationEntity();
    notification.title = title;
    notification.body = body;
    notification.subscribersNotifications = [];
    return await notification.save();
  }
}
