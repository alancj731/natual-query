"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <Card className="bg-red-50 border-red-200 shadow-sm">
      <CardContent className="py-4">
        <div className="flex items-start gap-2">
          <span className="text-red-600 text-sm shrink-0 font-medium">Error:</span>
          <p className="text-red-700 text-sm font-mono">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
