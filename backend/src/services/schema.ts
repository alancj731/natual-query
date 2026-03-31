import { Pool } from "pg";

let cachedSchema: string = "";

export async function initializeSchema(pool: Pool): Promise<void> {
  const columnsResult = await pool.query(`
    SELECT table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name NOT LIKE 'payment_p%'
    ORDER BY table_name, ordinal_position
  `);

  const fkResult = await pool.query(`
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
  `);

  const tableColumns: Record<string, string[]> = {};
  for (const row of columnsResult.rows) {
    const tableName: string = row.table_name;
    if (!tableColumns[tableName]) {
      tableColumns[tableName] = [];
    }
    const nullable = row.is_nullable === "YES" ? "NULL" : "NOT NULL";
    tableColumns[tableName].push(
      `  ${row.column_name} ${row.data_type} ${nullable}`
    );
  }

  const lines: string[] = [];
  for (const [table, columns] of Object.entries(tableColumns)) {
    lines.push(`TABLE ${table} (`);
    lines.push(columns.join(",\n"));
    lines.push(");\n");
  }

  lines.push("\n-- Foreign Keys:");
  for (const fk of fkResult.rows) {
    lines.push(
      `FK: ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`
    );
  }

  cachedSchema = lines.join("\n");
  console.log(
    `Schema loaded: ${Object.keys(tableColumns).length} tables, ${fkResult.rows.length} foreign keys`
  );
}

export function getSchema(): string {
  return cachedSchema;
}
