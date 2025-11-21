import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { RequestUploadDTO } from './dtos/request-upload.dto';
import { FilePlan } from 'src/storage/interfaces/file-plan.interface';
import { ConfigService } from '@nestjs/config';
import { IngestionPayload } from 'src/kafka/interfaces/kafka-payload.interface';
import { KafkaService } from 'src/kafka/kafka.service';
import { randomUUID } from 'crypto';
import { StartProcessDTO } from './dtos/start-process.dto';

@Injectable()
export class AnalysisService {
    private ingestionPath: string;
    private ingestionTopic: string;
    private readonly logger = new Logger(AnalysisService.name);
    constructor(
        private readonly storageService: StorageService,
        private readonly configService: ConfigService,
        private readonly kafkaService: KafkaService,
    ) {
        this.ingestionPath = this.configService.get('process').ingestionPath;
        this.ingestionTopic = this.configService.get('kafka').topics.ingestion;
    }

    async getPresignedUploadUrls(requestUploadDto: RequestUploadDTO) {
        const files: FilePlan[] = requestUploadDto.images
        const options = { prefix: this.ingestionPath };
        return this.storageService.generatePresignedUrl(files, options)
    }

    async queueImagesForProcessing(startProcessDto: StartProcessDTO) {
        try {
            const jobId = randomUUID();
            const promises = startProcessDto.imagesUrl.map(async (imageUrl) => {
                const payload: IngestionPayload = {
                    jobId,
                    file: imageUrl,
                    timestamp: new Date().toISOString(),
                };
                const messageKey = randomUUID();
                return this.kafkaService.emit(this.ingestionTopic, messageKey, payload);
            })
            await Promise.all(promises);
            this.logger.log(`✅ Job [${jobId}]: Successfully queued ${promises.length} images to Kafka.`);
            return {
                jobId,
                status: 'QUEUED',
                message: `${startProcessDto.imagesUrl.length} images have been queued for processing.`,
            }
        } catch (error) {
            this.logger.error(`Failed to queue images for processing: ${error}`);
            throw new InternalServerErrorException('Failed to queue images for processing.')
        }
    }
}
