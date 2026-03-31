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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <header className="space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-geist-sans)]">
              QueryDB
            </h1>
            {(response || networkError) && (
              <button
                onClick={handleClear}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-sm text-zinc-500">
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
