import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { CommentsService } from "src/comments/comments.service";
import { Creation } from "src/creations/creations.model";
import { MReadHistoryService } from "src/m-read-history/m-read-history.service";
import { Message, SentMessage } from "src/messages/messages.model";
import { MessagesService } from "src/messages/messages.service";
import { Room } from "src/rooms/rooms.model";
import { RoomsService } from "src/rooms/rooms.service";

type ConnectCommentsDto = {
  creationId: number,
}

type DiscCommReqDto = {
  creationId: number,
}

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
    private mReadHistorySerivce: MReadHistoryService,
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
    const members = await this.roomsService.getAllMembersByRoom(message.roomId);
    const userIds = members.map(member => member.userId);
    await this.mReadHistorySerivce.createAllStatusesByMessage(dbMessage.id, userIds);
    this.server.to(String(message.roomId)).emit('message', dbMessage);
  }

  @SubscribeMessage('readMessage')
  async onReadMessage(@MessageBody() readMessage: {
    messageId: number,
    userId: number,
    roomId: number,
  }) {
    console.log(readMessage);
    const newStatus = await this.mReadHistorySerivce.readMessage(readMessage.messageId, readMessage.userId);
    this.server.to(String(readMessage.roomId)).emit('readMessage', newStatus);
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

  // @SubscribeMessage('openCreationComments')
  // async onOpenCreationComments(@MessageBody() {userId, creationId} : {userId: number, creationId: number}) {
  //   const clients = await this.server.fetchSockets();
  //   const client = clients.find(client => client.handshake.auth.authDto.id == userId);
  //   if (client) {
  //     client.join('creation' + creationId);
  //   }
  // }

  @SubscribeMessage('sendComment')
  async onComment(
    @MessageBody() reqCommentDto: {text: string, creationId: number, authorId: number},
  ) {
    console.log('sendComment');
    console.log(reqCommentDto);
    const comment = await this.commentsService.createComment(
      reqCommentDto.authorId,
      reqCommentDto.text,
      reqCommentDto.creationId,
    );
    this.server.to('c' + reqCommentDto.creationId).emit('comment', {comment});
  }

  @SubscribeMessage('connectComments')
  async connectComments(
    @MessageBody() dto: ConnectCommentsDto,
    @ConnectedSocket() client,
  ) {
    console.log('connectComments')
    
    await this.disconnectComments(client);

    client.join('c' + dto.creationId);

    const conComResDto: ConnectCommentsDto = { creationId: dto.creationId }
    client.emit('connectComments', conComResDto);
  }

  async disconnectComments(client) {
    const rooms = Array.from(client.rooms);
    
    const commentsRooms = rooms.filter(room => room[0] === 'c');
    for (let commentsRoom of commentsRooms) {
      client.leave(commentsRoom);
      // const discCommReqDto: DiscCommReqDto = {

      // }
      // client.emit('disconnectComments', )
    }
  }

  async emitDeleteMessage(message: Message) {
    this.server.to(String(message.roomId)).emit('deleteMessage', message);
  }
}