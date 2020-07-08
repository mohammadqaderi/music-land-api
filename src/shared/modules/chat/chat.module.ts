import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';
import { UserJoinedRoom } from './entities/user-joined-room.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../../commons/constants/auth-constants';
import { RoomController } from './room.controller';
import { ChatService } from './chat.service';
import { AuthModule } from '../../../modules/auth/auth.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message, UserJoinedRoom]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
    forwardRef(() => AuthModule)],
  providers: [ChatGateway, ChatService],
  controllers: [RoomController],
  exports: [ChatService],
})
export class ChatModule {
}
