import { Module } from '@nestjs/common';
import { HealthStatusController } from './app.controller';
import { HealthStatusService } from './app.service';
import { ConfigModule } from './config/config.module';
import { StorageModule } from './storage/storage.module';
import { AnalysisModule } from './analysis/analysis.module';
import { KafkaModule } from './kafka/kafka.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [ConfigModule, StorageModule, AnalysisModule, KafkaModule, NotificationsModule],
  controllers: [HealthStatusController],
  providers: [HealthStatusService, NotificationsGateway],
})
export class AppModule { }
