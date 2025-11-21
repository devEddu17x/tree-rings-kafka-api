import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private readonly logger: Logger = new Logger(KafkaService.name);

    constructor(private readonly configService: ConfigService) {
        const kafkaConfig = this.configService.get('kafka').config;
        this.kafka = new Kafka(kafkaConfig);
        this.producer = this.kafka.producer();
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
            await this.producer.disconnect();
        } catch (error) {
            this.logger.error('Can not disconnect from Kafka broker: ' + error);
        }
    }

    async emit(topic: string, key: string, value: any): Promise<void> {
        try {
            const messageValue = JSON.stringify(value);

            await this.producer.send({
                topic,
                messages: [
                    {
                        key,
                        value: messageValue,
                    },
                ],
            });
        } catch (error) {
            this.logger.error(`Error sending message to topic ${topic}: ${error}`);
        }
    }
}
