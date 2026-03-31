"use client";

import { useState } from "react";
import { QueryInput } from "@/components/query-input";
import { SqlDisplay } from "@/components/sql-display";
import { ResultsTable } from "@/components/results-table";
import { ErrorDisplay } from "@/components/error-display";
import { executeQuery, type QueryResponse } from "@/lib/api";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setNetworkError(null);
    setResponse(null);

    try {
      const result = await executeQuery(trimmed);
      setResponse(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to connect to backend";
      setNetworkError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQuestion("");
    setResponse(null);
    setNetworkError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-800 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                QueryDB
              </h1>
            </div>
            {(response || networkError) && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-sm text-slate-500 pl-12">
            Ask questions in plain English. Get SQL and results from your
            database.
          </p>
        </header>

        <QueryInput
          value={question}
          onChange={setQuestion}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {networkError && <ErrorDisplay message={networkError} />}

        {response?.error && <ErrorDisplay message={response.error} />}

        {response?.sql && <SqlDisplay sql={response.sql} />}

        {response && !response.error && (
          <ResultsTable
            columns={response.columns}
            rows={response.rows}
            executionTimeMs={response.executionTimeMs}
          />
        )}
      </div>
    </div>
  );
}
