import { Module } from '@nestjs/common';
import { HealthStatusController } from './app.controller';
import { HealthStatusService } from './app.service';

@Module({
  imports: [],
  controllers: [HealthStatusController],
  providers: [HealthStatusService],
})
export class AppModule {}
