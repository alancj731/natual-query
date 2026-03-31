import { Pool } from "pg";
import { QueryResponse } from "../types";

const FORBIDDEN_KEYWORDS =
  /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXEC|EXECUTE)\b/i;

function validateSQL(sql: string): string | null {
  const trimmed = sql.trim();

  if (!trimmed.toUpperCase().startsWith("SELECT")) {
    return "Only SELECT statements are allowed";
  }

  if (FORBIDDEN_KEYWORDS.test(trimmed)) {
    return "Query contains forbidden keywords (write/DDL operations are not allowed)";
  }

  // Reject multiple statements (semicolon followed by non-whitespace)
  const withoutStrings = trimmed.replace(/'[^']*'/g, "");
  const statements = withoutStrings.split(";").filter((s) => s.trim().length > 0);
  if (statements.length > 1) {
    return "Multiple statements are not allowed";
  }

  return null;
}

export async function executeQuery(
  pool: Pool,
  sql: string
): Promise<QueryResponse> {
  const validationError = validateSQL(sql);
  if (validationError) {
    return {
      sql,
      columns: [],
      rows: [],
      executionTimeMs: 0,
      error: validationError,
    };
  }

  const client = await pool.connect();
  const startTime = Date.now();

  try {
    await client.query("BEGIN TRANSACTION READ ONLY");
    await client.query("SET LOCAL statement_timeout = '10s'");

    const result = await client.query(sql);

    await client.query("COMMIT");

    const columns = result.fields.map((f) => f.name);
    const rows = result.rows as Record<string, unknown>[];

    return {
      sql,
      columns,
      rows,
      executionTimeMs: Date.now() - startTime,
      error: null,
    };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    const message = err instanceof Error ? err.message : "Query execution failed";
    return {
      sql,
      columns: [],
      rows: [],
      executionTimeMs: Date.now() - startTime,
      error: message,
    };
  } finally {
    client.release();
  }
}
