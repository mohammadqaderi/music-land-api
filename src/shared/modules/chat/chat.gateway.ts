import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { UserJoinedRoom } from './entities/user-joined-room.entity';
import { forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/auth.service';
import { Socket } from 'socket.io';
import { User } from '../../../modules/auth/entities/user.entity';
import { ChatService } from './chat.service';

// this is a provider
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private chatService: ChatService,
              @Inject(forwardRef(() => AuthService)) private authService: AuthService,
              @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
              @InjectRepository(Room) private readonly roomRepository: Repository<Room>) {
  }


  /*
  * this server is public server ,that used to detect the number of available users
  * on the chat
  *
  * */
  @WebSocketServer() server;


  private users = 0;

  async handleConnection() {

    // A client has connected
    this.users++;

    // Notify connected clients of current users
    this.server.emit('connected-users', this.users);

  }

  async handleDisconnect(client: Socket) {

    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    this.server.emit('connected-users', this.users);

    // Notify when the user disconnected and has leaved
    if (client && client.id) {
      const user = await this.authService.findUser(null, null, client.id);
      client.server.emit('users-changed', { user: user.username, event: 'left' });
    }

  }


  @SubscribeMessage('enter-chat-room')
  async enterChatRoom(client: Socket, data: { nickname: string, roomId: number }) {
    const { nickname, roomId } = data;
    const user: User = await this.authService.findUser(null, nickname);
    const room = await this.chatService.getRoomById(roomId);

    // this object will not be created only if the user has not join the room
    let userJoinedRoom: UserJoinedRoom;

    // this function is used to determine if the user has joined this room or not
    let isUserJoined = () =>
      user.userJoinedRooms.some(userJoinedRoom => userJoinedRoom.roomId === roomId);


    // if the user does not join the room, we will create the user joined room object
    if (!isUserJoined()) {
      userJoinedRoom = new UserJoinedRoom();
      userJoinedRoom.user = user;
      userJoinedRoom.room = room;
      userJoinedRoom.joinedUsername = user.username;
      await userJoinedRoom.save();
    }

    // if the user does not have a clientId we will give him a one to use it in connection and
    // disconnection cases
    if (!user.clientId) {
      user.clientId = client.id;
      await user.save();
    }
    client.join(roomId.toString()).broadcast.to(roomId.toString(),
    ).emit('users-changed', { user: user.username, event: 'joined' });
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(client: Socket, data: { nickname: string, roomId: number }) {
    const { nickname, roomId } = data;
    const user: User = await this.authService.findUser(null, nickname);

    // Notify the users in the room that this client has leaved
    client.broadcast.to(roomId.toString()).emit('users-changed', {
      user: user.username, event: 'left',
    });
    client.leave(roomId.toString());
  }

  @SubscribeMessage('add-message')
  async addMessage(client: Socket, data: { text: string, roomId: number, userId: number }) {
    const { text, roomId, userId } = data;
    const user = await this.authService.findUser(userId);
    const room = await this.chatService.getRoomById(roomId);
    const message = await this.createMessage(user, room, text);

    // pushing the message in the room chat immediately after the user sent the message
    client.server.emit('message', message);
  }

  async createMessage(user: User, room: Room, text: string): Promise<Message> {
    const msg = new Message();
    msg.text = text;
    msg.user = user;
    msg.room = room;
    msg.roomName = room.name;
    msg.created = new Date();
    return await msg.save();
  }


}
