import { Body, Controller, Post } from '@nestjs/common';
import { RequestUploadDTO } from './dtos/request-upload.dto';
import { AnalysisService } from './analysis.service';
import { StartProcessDTO } from './dtos/start-process.dto';

@Controller('analysis')
export class AnalysisController {
    constructor(private readonly analysisService: AnalysisService) { }

    @Post('request-upload')
    async requestUploadImage(@Body() requestUploadDto: RequestUploadDTO) {
        return this.analysisService.getPresignedUploadUrls(requestUploadDto);
    }

    @Post('start-process')
    async startProcess(@Body() startProcessDto: StartProcessDTO) {
        return this.analysisService.queueImagesForProcessing(startProcessDto)
    }

}
