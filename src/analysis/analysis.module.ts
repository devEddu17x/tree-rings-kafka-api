import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { StorageModule } from 'src/storage/storage.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [StorageModule, KafkaModule],
  controllers: [AnalysisController],
  providers: [AnalysisService]
})
export class AnalysisModule { }
