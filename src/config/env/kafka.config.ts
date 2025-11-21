import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => {
    const {
        NODE_ENV,
        KAFKA_BROKERS,
        KAFKA_CLIENT_ID,
        KAFKA_GROUP_ID,
        KAFKA_SSL,
        KAFKA_SASL_MECHANISM,
        KAFKA_USERNAME,
        KAFKA_PASSWORD,
        KAFKA_INGESTION_TOPIC,
        KAFKA_RESULTS_TOPIC,
    } = process.env;

    const isProduction = NODE_ENV === 'production';

    const requiredVars = [
        ['KAFKA_BROKERS', KAFKA_BROKERS],
        ['KAFKA_CLIENT_ID', KAFKA_CLIENT_ID],
        ['KAFKA_GROUP_ID', KAFKA_GROUP_ID],
    ];

    if (isProduction) {
        requiredVars.push(
            ['KAFKA_SSL', KAFKA_SSL],
            ['KAFKA_SASL_MECHANISM', KAFKA_SASL_MECHANISM],
            ['KAFKA_USERNAME', KAFKA_USERNAME],
            ['KAFKA_PASSWORD', KAFKA_PASSWORD],
        );
    }

    const missingVars = requiredVars
        .filter(([, value]) => !value)
        .map(([name]) => name);

    if (missingVars.length) {
        throw new Error(
            `Missing required KAFKA env vars for ${NODE_ENV || 'unknown'} env: ${missingVars.join(', ')}`,
        );
    }

    const config: any = {
        clientId: KAFKA_CLIENT_ID,
        groupId: KAFKA_GROUP_ID,
        brokers: KAFKA_BROKERS?.split(',').map((b) => b.trim()) || [],
        ssl: KAFKA_SSL === 'true',
        sasl: undefined,
    };

    if (KAFKA_USERNAME?.trim() && KAFKA_PASSWORD?.trim() && KAFKA_SASL_MECHANISM?.trim()) {
        config.sasl = {
            mechanism: KAFKA_SASL_MECHANISM.toLowerCase(),
            username: KAFKA_USERNAME,
            password: KAFKA_PASSWORD,
        };
    }

    return {
        config,
        topics: {
            ingestion: KAFKA_INGESTION_TOPIC,
            results: KAFKA_RESULTS_TOPIC,
        }
    };
});