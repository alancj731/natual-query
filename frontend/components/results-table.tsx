"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultsTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
  executionTimeMs: number;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }
  return String(value);
}

export function ResultsTable({
  columns,
  rows,
  executionTimeMs,
}: ResultsTableProps) {
  if (columns.length === 0) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="py-8 text-center text-slate-400">
          No results returned.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-500">
          Results
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-500 border-slate-200">
            {rows.length} row{rows.length !== 1 ? "s" : ""}
          </Badge>
          <Badge variant="outline" className="text-slate-500 border-slate-200">
            {executionTimeMs}ms
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="text-slate-500 font-mono text-xs"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={i}
                className="border-slate-50 hover:bg-slate-50"
              >
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    className="text-slate-700 font-mono text-sm"
                  >
                    {formatValue(row[col])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
