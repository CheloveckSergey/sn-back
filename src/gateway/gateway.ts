import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { SentMessage } from "src/messages/messages.model";
import { MessagesService } from "src/messages/messages.service";
import { RoomsService } from "src/rooms/rooms.service";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000']
  }
})
export class Gateway implements OnModuleInit {

  constructor(
    private roomsService: RoomsService,
    private messagesService: MessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log('CONNECTION: ' + socket.id);
      console.log('AUTH authDto:');
      console.log(socket.handshake.auth.authDto);
      const rooms = await this.roomsService.getAllRoomsByUserId(Number(socket.handshake.auth.authDto.id));
      console.log('Rooms: ');
      console.log(rooms);
      socket.join(rooms.map(room => String(room.id)));
    })
  }

  @SubscribeMessage('message')
  async onMessage(@MessageBody() message: SentMessage) {
    console.log(message);
    // this.server.emit('message', message);
    const dbMessage = await this.messagesService.createMessage(message.userId, message.roomId, message.text);
    this.server.to(String(message.roomId)).emit('message', dbMessage);
  }
}