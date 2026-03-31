const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface QueryResponse {
  sql: string | null;
  columns: string[];
  rows: Record<string, unknown>[];
  executionTimeMs: number;
  error: string | null;
}

export async function executeQuery(question: string): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (body?.error) {
      return body as QueryResponse;
    }
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
