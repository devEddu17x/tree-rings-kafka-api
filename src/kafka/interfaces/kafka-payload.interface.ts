export interface IngestionPayload {
    jobId: string;
    file: string;
    timestamp: string;
    clientId: string;
    metadata: {
        coordinatesX: number;
        coordinatesY: number;
    };
}