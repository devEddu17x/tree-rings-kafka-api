import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { ResultPaylod } from './interfaces/kafka-result-paylod.interface';
import { KafkaService } from './kafka.service';

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ConsumerService.name);
    private readonly topic: string;
    private consumer: Consumer;

    constructor(
        private readonly configService: ConfigService,
        private readonly notificationsGateway: NotificationsGateway,
        private readonly kafkaService: KafkaService,
    ) {
        this.topic = this.configService.get('kafka').topics.results;
    }

    async onModuleInit() {
        const groupId = this.configService.get('kafka').config.groupId;
        this.consumer = await this.kafkaService.createConsumer(groupId);
        await this.subscribe();
    }

    async onModuleDestroy() {
        await this.disconnect();
    }

    private async subscribe() {
        try {
            await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        if (!message.value) {
                            return this.logger.warn('Received message with empty value');
                        }
                        const value = message.value.toString();
                        const payload: ResultPaylod = JSON.parse(value);

                        if (!payload.clientId) {
                            return this.logger.warn('Message received without clientId');
                        }
                        this.logger.log(`Received message from topic ${topic}`);
                        this.notificationsGateway.notifyClient(payload.clientId, payload);

                    } catch (error) {
                        return this.logger.error(`Error processing message: ${error}`);
                    }
                },
            });
            this.logger.log(`Consumer connected and subscribed to ${this.topic}`);
        } catch (error) {
            this.logger.error('Failed to connect to Kafka consumer', error);
        }
    }

    private async disconnect() {
        try {
            await this.consumer.disconnect();
            this.logger.log('Consumer disconnected');
        } catch (error) {
            this.logger.error('Failed to disconnect Kafka consumer', error);
        }
    }
}
