import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly wsConfig: any;

  constructor(private readonly configService: ConfigService) {
    this.wsConfig = this.configService.get('websocket');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const clientId = client.handshake.query.clientId as string;

    if (!clientId) {

      this.logger.warn(`Connection rejected: Missing clientId (socket: ${client.id})`);
      client.emit('error', {
        message: 'Client ID is required for connection. You should provide it as a query parameter (clientId).',
        code: 'MISSING_CLIENT_ID',
      });
      client.disconnect(true);
      return;
    }

    client.join(clientId);
    this.logger.log(`Client connected: ${clientId} (socket: ${client.id})`);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.handshake.query.clientId as string;
    this.logger.log(`Client disconnected: ${clientId || client.id}`);
  }

  notifyClient(clientId: string, payload: any) {
    const eventName = this.wsConfig.events.processFinished;
    this.server.to(clientId).emit(eventName, payload);
    this.logger.log(`Notification sent to ${clientId}`);
  }
}