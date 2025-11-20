import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilePlan } from './interfaces/file-plan.interface';
import { PresignedPut } from './interfaces/presigned-url.interface';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
    private s3: S3Client;
    private bucket: string;
    private ingestionUrl: string;
    constructor(private readonly configService: ConfigService) {
        const storage = this.configService.get('storage');
        this.s3 = new S3Client(storage.config);
        this.bucket = storage.bucket;
        this.ingestionUrl = storage.baseUrlIngestion;
    }

    private buildKey(filename: string): string {
        const extension = filename.includes('.') ? filename.split('.').pop() : 'bin';
        const timestamp = Date.now();
        return `$${this.ingestionUrl}/${filename}_${timestamp}.${extension}`;
    }

    async generatePresignedUrl(
        files: FilePlan[],
        opts?: { ttlSeconds?: number; cacheControl?: string },
    ): Promise<PresignedPut[]> {
        const ttl = opts?.ttlSeconds ?? 600; // 10 min
        const cacheControl = opts?.cacheControl ?? 'no-cache';

        const promises = files.map(async (f) => {
            const key = this.buildKey(f.filename);
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                ContentType: f.contentType,
                CacheControl: cacheControl,
            });

            const putUrl = await getSignedUrl(this.s3, command, { expiresIn: ttl });
            const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

            return {
                key,
                putUrl,
                expiresAt,
                requiredHeaders: {
                    'Content-Type': f.contentType,
                },
            };
        });

        return Promise.all(promises);
    }
}
