"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <Card className="bg-red-950/30 border-red-900/50">
      <CardContent className="py-4">
        <div className="flex items-start gap-2">
          <span className="text-red-400 text-sm shrink-0">Error:</span>
          <p className="text-red-300 text-sm font-mono">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
