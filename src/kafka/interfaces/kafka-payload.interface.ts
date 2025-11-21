export interface IngestionPayload {
    jobId: string;
    file: string;
    timestamp: string;
    metadata: {
        coordinatesX: number;
        coordinatesY: number;
    };
}