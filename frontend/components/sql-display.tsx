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
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-zinc-400">
          Generated SQL
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-xs text-zinc-500 hover:text-zinc-300 h-7"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap overflow-x-auto leading-relaxed">
          {sql}
        </pre>
      </CardContent>
    </Card>
  );
}
