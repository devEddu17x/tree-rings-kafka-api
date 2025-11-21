import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { IngestionPayload } from './interfaces/kafka-payload.interface';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private topics: { ingestion: string; results: string };
    private readonly logger: Logger = new Logger(KafkaService.name);

    constructor(private readonly configService: ConfigService) {
        const kafkaConfig = this.configService.get('kafka').config;
        const topics = this.configService.get('kafka').topics;
        this.kafka = new Kafka(kafkaConfig);
    }
    onModuleInit() {
        this.connect();
    }
    onModuleDestroy() {
        this.disconnect();
    }
    private async connect() {
        try {
            await this.producer.connect();
        } catch (error) {
            this.logger.error('Can not connect to Kafka: ' + error);
        }
    }
    private async disconnect() {
        try {
            await this.producer.connect();
        } catch (error) {
            this.logger.error('Can not connect to Kafka broker: ' + error);
        }
    }

    async emitIngestionEvent(payload: IngestionPayload, topic: string): Promise<void> {

        try {
            const messageValue = JSON.stringify(payload);

            await this.producer.send({
                topic,
                messages: [
                    {
                        key: payload.jobId,
                        value: messageValue,
                    },
                ],
            });

        } catch (error) {
        }
    }
}
