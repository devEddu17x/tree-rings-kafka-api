import { Module } from '@nestjs/common';
import { HealthStatusController } from './app.controller';
import { HealthStatusService } from './app.service';
import { ConfigModule } from './config/config.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [ConfigModule, StorageModule],
  controllers: [HealthStatusController],
  providers: [HealthStatusService],
})
export class AppModule {}
