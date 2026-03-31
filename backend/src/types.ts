export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  sql: string | null;
  columns: string[];
  rows: Record<string, unknown>[];
  executionTimeMs: number;
  error: string | null;
}
