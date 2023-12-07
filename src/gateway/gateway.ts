import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { CommentsService } from "src/comments/comments.service";
import { Creation } from "src/creations/creations.model";
import { SentMessage } from "src/messages/messages.model";
import { MessagesService } from "src/messages/messages.service";
import { Room } from "src/rooms/rooms.model";
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
    private commentsService: CommentsService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log('CONNECTION: ' + socket.id);
      const rooms = await this.roomsService.getAllRoomsByUserId(Number(socket.handshake.auth.authDto.id));
      socket.join(rooms.map(room => String(room.id)));
    })
  }

  @SubscribeMessage('message')
  async onMessage(@MessageBody() message: SentMessage) {
    const dbMessage = await this.messagesService.createMessage(message.userId, message.roomId, message.text);
    this.server.to(String(message.roomId)).emit('message', dbMessage);
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(@MessageBody() room: Room) {
    const clients = await this.server.fetchSockets();
    const roomClients = clients.filter(client => {
      const roomMember = room.roomMembers.find(roomMember => client.handshake.auth.authDto.id == roomMember.userId);
      if (roomMember) {
        return true;
      } else {
        return false;
      }
    });
    roomClients.forEach(roomClient => {
      roomClient.join(String(room.id));
    })
  }

  @SubscribeMessage('openCreationComments')
  async onOpenCreationComments(@MessageBody() {userId, creationId} : {userId: number, creationId: number}) {
    const clients = await this.server.fetchSockets();
    const client = clients.find(client => client.handshake.auth.authDto.id == userId);
    if (client) {
      client.join('creation' + creationId);
    }
  }

  @SubscribeMessage('comment')
  async onComment(
    @MessageBody() reqCommentDto: {text: string, creationId: number, authorId: number},
    @ConnectedSocket() client,
  ) {
    const comment = await this.commentsService.createComment(
      reqCommentDto.authorId,
      reqCommentDto.text,
      reqCommentDto.creationId,
    );
    this.server.to('creation' + reqCommentDto.creationId).emit('comment', comment);
  }

  async joinRoom(userIds: number[]) {
    const clients = await this.server.fetchSockets();
    
  }
}