import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { RequestUploadDTO } from './dtos/request-upload.dto';
import { FilePlan } from 'src/storage/interfaces/file-plan.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalysisService {
    private ingestionPath: string;
    constructor(
        private readonly storageService: StorageService,
        private readonly configService: ConfigService,
    ) {
        this.ingestionPath = this.configService.get('process').ingestionPath;
    }

    async getPresignedUploadUrls(requestUploadDto: RequestUploadDTO) {
        const files: FilePlan[] = requestUploadDto.images
        const options = { prefix: this.ingestionPath };
        return this.storageService.generatePresignedUrl(files, options)
    }
}
