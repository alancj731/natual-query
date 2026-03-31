"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EXAMPLE_QUERIES = [
  "Top 10 customers by total payment",
  "How many films per category?",
  "Actors in the most films",
  "R-rated films longer than 2 hours",
  "Total revenue by month",
];

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function QueryInput({
  value,
  onChange,
  onSubmit,
  loading,
}: QueryInputProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Textarea
          placeholder="Ask a question about the database... (e.g., 'Show me the top 10 customers by total payment')"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="flex-1 resize-none bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
        />
        <Button
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="self-end px-6"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Running...
            </span>
          ) : (
            "Query"
          )}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-zinc-500 self-center">Try:</span>
        {EXAMPLE_QUERIES.map((q) => (
          <Badge
            key={q}
            variant="outline"
            className="cursor-pointer hover:bg-zinc-800 text-zinc-400 border-zinc-700 transition-colors"
            onClick={() => onChange(q)}
          >
            {q}
          </Badge>
        ))}
      </div>
    </div>
  );
}
