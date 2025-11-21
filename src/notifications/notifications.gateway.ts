import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly wsConfig: any;
  constructor(private readonly configService: ConfigService) {
    this.wsConfig = this.configService.get('websocket');
  }
  @WebSocketServer()
  server: Server;

  private logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    const clientId = client.handshake.query.clientId as string;

    if (clientId) {
      client.join(clientId);
      this.logger.log(`Client connected: ${clientId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  notifyClient(clientId: string, payload: any) {
    const eventName = this.wsConfig.events.processFinished;
    this.server.to(clientId).emit(eventName, payload);
    this.logger.log(`Notification sent to ${clientId}`);
  }
}