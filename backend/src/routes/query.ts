import { Router, Request, Response } from "express";
import { Pool } from "pg";
import { generateSQL } from "../services/llm";
import { executeQuery } from "../services/executor";
import { QueryRequest, QueryResponse } from "../types";

const MAX_QUESTION_LENGTH = 500;

export function createQueryRouter(pool: Pool): Router {
  const router = Router();

  router.post("/", async (req: Request, res: Response) => {
    const body = req.body as QueryRequest;

    if (!body.question || typeof body.question !== "string") {
      const errorResponse: QueryResponse = {
        sql: null,
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: "Missing or invalid 'question' field",
      };
      res.status(400).json(errorResponse);
      return;
    }

    const question = body.question.trim();
    if (question.length === 0) {
      const errorResponse: QueryResponse = {
        sql: null,
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: "Question cannot be empty",
      };
      res.status(400).json(errorResponse);
      return;
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      const errorResponse: QueryResponse = {
        sql: null,
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: `Question too long (max ${MAX_QUESTION_LENGTH} characters)`,
      };
      res.status(400).json(errorResponse);
      return;
    }

    try {
      const sql = await generateSQL(question);
      const result = await executeQuery(pool, sql);
      res.json(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate SQL";
      const errorResponse: QueryResponse = {
        sql: null,
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: message,
      };
      res.status(500).json(errorResponse);
    }
  });

  return router;
}
