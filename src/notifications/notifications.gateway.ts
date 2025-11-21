import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    const clientId = client.handshake.query.clientId as string;

    if (clientId) {
      client.join(clientId);
      this.logger.log(`Cliente conectado: ${clientId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  notifyClient(clientId: string, payload: any) {
    this.server.to(clientId).emit('processing-finished', payload);
    this.logger.log(`Notificación enviada a ${clientId}`);
  }
}