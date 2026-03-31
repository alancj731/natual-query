import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { initializeSchema } from "./services/schema";
import { createQueryRouter } from "./routes/query";

const PORT = process.env.PORT || 3105;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://natural-query-frontend.vercel.app"],
    methods: ["POST"],
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/query", createQueryRouter(pool));

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL");

    await initializeSchema(pool);

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
