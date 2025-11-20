export interface IngestionPayload {
    jobId: string;
    files: string[];
    timestamp: string;
    metadata?: Record<string, any>;
}