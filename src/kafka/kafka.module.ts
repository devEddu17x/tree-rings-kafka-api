import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConsumerService } from './consumer.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [KafkaService, ConsumerService],
  exports: [KafkaService],
})
export class KafkaModule { }
