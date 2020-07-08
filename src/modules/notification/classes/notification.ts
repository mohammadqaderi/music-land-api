import { NotificationData } from './notification-data';
import { Content } from './content';

export class Notification {
  title: string;
  body: string;
  icon: string;
  vibrate: Array<number>;
  data: NotificationData;
  actions: Content[];
}
