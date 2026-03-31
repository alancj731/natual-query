"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SqlDisplayProps {
  sql: string;
}

export function SqlDisplay({ sql }: SqlDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="bg-slate-50 border-slate-200 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-500">
          Generated SQL
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-slate-600 h-7"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="text-sm font-mono text-emerald-700 whitespace-pre-wrap overflow-x-auto leading-relaxed bg-white rounded-md p-3 border border-slate-100">
          {sql}
        </pre>
      </CardContent>
    </Card>
  );
}
