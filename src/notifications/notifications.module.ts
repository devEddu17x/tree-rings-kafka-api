import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule { }
