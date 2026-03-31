# QueryDB

Ask questions in plain English and get SQL queries and results from a PostgreSQL database. Uses Google Gemini to convert natural language to SQL.

## Architecture

```
Frontend (Next.js)  -->  Backend (Express)  -->  PostgreSQL
                              |
                         Google Gemini
                    (natural language -> SQL)
```

- **Frontend** — Next.js 16, React 19, shadcn/ui, Tailwind CSS (`localhost:3000`)
- **Backend** — Express 5, TypeScript, pg (`localhost:3105`)
- **Database** — Supabase PostgreSQL (or local Docker with Pagila sample data)
- **AI** — Google Gemini (`gemini-3-flash-preview`)

## Prerequisites

- Node.js 20+
- Google Gemini API key
- Supabase account (free) **or** Docker & Docker Compose (for local dev)

## Get a Gemini API Key

You can get a free Gemini API key by signing up for a Google account and enabling the free trial on Google Cloud Platform:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with a Google account (create one for free if needed)
3. Click "Create API Key" — no credit card required for the free tier

The free tier includes generous rate limits for experimentation.

## Getting Started

### 1. Set up the database

#### Option A: Supabase (recommended)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings > Database** and copy the connection string (URI)
4. To load sample data, go to **SQL Editor** and run the contents of `db/init/pagila-schema.sql` then `db/init/pagila-data.sql`

#### Option B: Local Docker

```bash
npm run db:up
```

This starts PostgreSQL in Docker and loads the [Pagila](https://github.com/devrimgunduz/pagila) sample database automatically.

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

For local Docker, use:

```
DATABASE_URL=postgresql://postgres:yourpassword@127.0.0.1:5432/mydb
```

### 3. Install dependencies and run

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 and ask a question like "Show all actors whose last name starts with 'B'".

## Database Scripts (local Docker only)

| Command | Description |
|---------|-------------|
| `npm run db:up` | Start PostgreSQL in background |
| `npm run db:down` | Stop PostgreSQL |
| `npm run db:reset` | Destroy data and re-seed from scratch |

## Sample Queries to Try

- "How many films are in each category?"
- "List the top 5 customers by total payment amount"
- "Which actors appear in the most films?"
- "Show all rentals that haven't been returned yet"
- "What is the average rental rate by film rating?"

## Safety

The backend only allows `SELECT` queries. All mutations (`INSERT`, `UPDATE`, `DELETE`, DDL) are blocked. Queries run in read-only transactions with a 10-second timeout.
