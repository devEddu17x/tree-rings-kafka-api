import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => {
    const {
        STORAGE_ACCOUNT_ID,
        STORAGE_ACCESS_KEY_ID,
        STORAGE_SECRET_ACCESS_KEY,
        STORAGE_BUCKET_NAME,
        STORAGE_BASE_URL,

    } = process.env;

    const missingVars = [
        ['STORAGE_ACCOUNT_ID', STORAGE_ACCOUNT_ID],
        ['STORAGE_ACCESS_KEY_ID', STORAGE_ACCESS_KEY_ID],
        ['STORAGE_SECRET_ACCESS_KEY', STORAGE_SECRET_ACCESS_KEY],
        ['STORAGE_BUCKET_NAME', STORAGE_BUCKET_NAME],
        ['STORAGE_BASE_URL', STORAGE_BASE_URL],

    ]
        .filter(([, value]) => !value)
        .map(([name]) => name);

    if (missingVars.length) {
        throw new Error(
            `Missing required STORAGE env vars: ${missingVars.join(', ')}`,
        );
    }

    return {
        config: {
            region: 'auto',
            endpoint: STORAGE_BASE_URL,
            credentials: {
                accessKeyId: STORAGE_ACCESS_KEY_ID,
                secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
            },
        },
        bucket: STORAGE_BUCKET_NAME,
    };
});