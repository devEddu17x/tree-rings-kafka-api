import { registerAs } from '@nestjs/config';

export default registerAs('process', () => {
    const {
        PROCESS_INGESTION_PATH,
        PROCESS_RESULTS_PATH,
    } = process.env;

    const missingVars = [
        ['PROCESS_INGESTION_PATH', PROCESS_INGESTION_PATH],
        ['PROCESS_RESULTS_PATH', PROCESS_RESULTS_PATH],
    ]
        .filter(([, value]) => !value)
        .map(([name]) => name);

    if (missingVars.length) {
        throw new Error(
            `Missing required PROCESS env vars: ${missingVars.join(', ')}`,
        );
    }

    return {
        ingestionPath: PROCESS_INGESTION_PATH,
        resultsPath: PROCESS_RESULTS_PATH,
    };
});