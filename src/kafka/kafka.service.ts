import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
    private kafka: Kafka;
    private producer: Producer;
    constructor(private readonly configService: ConfigService) {
        const kafkaConfig = this.configService.get('kafka');
        this.kafka = new Kafka(kafkaConfig);
    }
}
