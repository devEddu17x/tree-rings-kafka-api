import { registerAs } from '@nestjs/config';

export default registerAs('cloudflare', () => {
    const {
        CLOUDFLARE_ACCOUNT_ID,
        CLOUDFLARE_ACCESS_KEY_ID,
        CLOUDFLARE_SECRET_ACCESS_KEY,
        CLOUDFLARE_BUCKET_NAME,
        CLOUDFLARE_BASE_URL,
        CLOUDFLARE_BASE_URL_INGESTION,
        CLOUDFLARE_BASE_URL_RESULTS,
    } = process.env;

    const missingVars = [
        ['CLOUDFLARE_ACCOUNT_ID', CLOUDFLARE_ACCOUNT_ID],
        ['CLOUDFLARE_ACCESS_KEY_ID', CLOUDFLARE_ACCESS_KEY_ID],
        ['CLOUDFLARE_SECRET_ACCESS_KEY', CLOUDFLARE_SECRET_ACCESS_KEY],
        ['CLOUDFLARE_BUCKET_NAME', CLOUDFLARE_BUCKET_NAME],
        ['CLOUDFLARE_BASE_URL', CLOUDFLARE_BASE_URL],
        ['CLOUDFLARE_BASE_URL_INGESTION', CLOUDFLARE_BASE_URL_INGESTION],
        ['CLOUDFLARE_BASE_URL_RESULTS', CLOUDFLARE_BASE_URL_RESULTS],
    ]
        .filter(([, value]) => !value)
        .map(([name]) => name);

    if (missingVars.length) {
        throw new Error(
            `Missing required Cloudflare env vars: ${missingVars.join(', ')}`,
        );
    }

    return {
        config: {
            region: 'auto',
            endpoint: CLOUDFLARE_BASE_URL,
            credentials: {
                accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
                secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
            },
        },
        bucket: CLOUDFLARE_BUCKET_NAME,
        baseUrlIngestion: CLOUDFLARE_BASE_URL_INGESTION,
        baseUrlResults: CLOUDFLARE_BASE_URL_RESULTS,
    };
});