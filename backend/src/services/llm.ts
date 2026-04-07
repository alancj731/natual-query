import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSchema } from "./schema";

const SYSTEM_PROMPT = `You are a PostgreSQL SQL expert. Given the database schema below and a natural language question, generate a single SELECT query that answers the question.

Rules:
- Output ONLY the SQL query, no explanation, no markdown fencing, no comments
- Use ONLY SELECT statements — never INSERT, UPDATE, DELETE, DROP, or any DDL
- Use only tables and columns from the provided schema
- Use proper PostgreSQL syntax
- For payment queries, use the "payment" table directly (it is partitioned but query it as one table)
- The "rating" column on film uses values: G, PG, PG-13, R, NC-17
- Limit results to 100 rows maximum unless the user specifies otherwise
- Use meaningful column aliases for aggregations
- Always qualify ambiguous column names with table aliases

Database Schema:
`;

export async function generateSQL(question: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
    systemInstruction: SYSTEM_PROMPT + getSchema(),
  });

  const result = await model.generateContent(question);
  const text = result.response.text().trim();

  // Strip markdown fences if present
  const cleaned = text
    .replace(/^```sql\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return cleaned;
}
