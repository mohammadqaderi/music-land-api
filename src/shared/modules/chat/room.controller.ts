import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../../../commons/guards/user-auth.guard';
import { Roles } from '../../../commons/decorators/roles.decorator';
import { Role } from '../../../commons/enums/role.enum';
import { GetAuthenticatedUser } from '../../../commons/decorators/get-authenticated-user.decorator';
import { User } from '../../../modules/auth/entities/user.entity';
import { RoomDto } from './dto/room.dto';
import { ChatService } from './chat.service';


@UseGuards(AuthGuard(), UserAuthGuard)
@Roles([Role.USER])
@Controller('rooms')
export class RoomController {
  constructor(private chatService: ChatService) {
  }

  @Get()
  getAllRooms() {
    return this.chatService.getAllRooms();
  }

  @Get(':id')
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getRoomById(id);
  }


  @Get('user-rooms')
  getUserRooms(@GetAuthenticatedUser() user: User) {
    return this.chatService.getUserRooms(user);
  }

  @Post()
  createNewRoom(@GetAuthenticatedUser() user: User,
                @Body() createRoomDto: RoomDto) {
    return this.chatService.createNewRoom(user, createRoomDto);
  }

  @Put(':id/edit-room')
  updateRoom(@Param('id', ParseIntPipe) id: number,
             @Body() updateRoomDto: RoomDto) {
    return this.chatService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id/delete-room')
  deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.deleteRoom(id);
  }


}
