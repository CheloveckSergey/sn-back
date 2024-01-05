import { Module, forwardRef } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MReadHistoryModule } from 'src/m-read-history/m-read-history.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    SequelizeModule.forFeature([
      Message,
    ]),
    MReadHistoryModule,
    forwardRef(() => GatewayModule),
  ],
  exports: [
    MessagesService,
  ]
})
export class MessagesModule {}
