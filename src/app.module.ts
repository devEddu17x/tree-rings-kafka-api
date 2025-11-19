import { Module } from '@nestjs/common';
import { HealthStatusController } from './app.controller';
import { HealthStatusService } from './app.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [HealthStatusController],
  providers: [HealthStatusService],
})
export class AppModule {}
