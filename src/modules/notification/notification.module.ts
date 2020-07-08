import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Subscriber } from './entities/subscriber.entity';
import { SubscribersNotifications } from './entities/subscribers-notifications.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, Subscriber, SubscribersNotifications]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {
}
