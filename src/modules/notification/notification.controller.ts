import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { Role } from '../../commons/enums/role.enum';
import { Roles } from '../../commons/decorators/roles.decorator';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { NotificationPayloadDto } from './notification-payload.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {

  constructor(private notificationService: NotificationService) {
  }

  @Get('subscribers')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  getAllSubscribers() {
    return this.notificationService.getAllSubscribers();
  }

  @Get('subscribers/:id')
  @UseGuards(AuthGuard(), AcceptedAuthGuard)
  @Roles([Role.ADMIN, Role.USER])
  getSubscriberById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.getSubscriberById(id);
  }

  @Post('subscribers/new')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  newSubscriber(@GetAuthenticatedUser() user: User, @Body() subscriber: any) {
    return this.notificationService.newSubscriber(user, subscriber);
  }

  @Post('send-notification')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  sendNotification(@Body() notificationPayloadDto: NotificationPayloadDto) {
    return this.notificationService.sendNewNotification(notificationPayloadDto);
  }
}
