import { JobStatus } from "../enums/job-status.enum";

export interface ResultPaylod {
    jobId: string;
    clientId: string;
    status: JobStatus;
    timestamp: Date;
    data?: {
        originalUrl: string;
        processedUrl: string;
        ringsCount: number;
        metadata: {
            coordinatesX: number;
            coordinatesY: number;
            processingTimeMs: number;
        };
    };
    error?: null;
}