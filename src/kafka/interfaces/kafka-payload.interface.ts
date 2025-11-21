export interface IngestionPayload {
    jobId: string;
    file: string;
    timestamp: string;
    metadata?: Record<string, any>;
}