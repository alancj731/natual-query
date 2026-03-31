#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./db/seed-supabase.sh 'postgresql://...connection_string...'"
  echo "Get your connection string from Supabase Dashboard > Settings > Database"
  exit 1
fi

DB_URL="$1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========================================="
echo "[seed] Loading Pagila schema into Supabase..."
echo "========================================="
sed \
  -e '/ALTER.*OWNER TO/d' \
  -e '/set_config.*search_path/d' \
  -e '/^SET row_security/d' \
  "$SCRIPT_DIR/init/01-pagila-schema.sql" | psql "$DB_URL"
echo "[seed] Schema loaded."

echo "========================================="
echo "[seed] Loading Pagila data into Supabase..."
echo "========================================="
sed \
  -e '/ALTER.*OWNER TO/d' \
  -e '/set_config.*search_path/d' \
  -e '/^SET row_security/d' \
  "$SCRIPT_DIR/init/02-pagila-data.sql" | psql "$DB_URL"
echo "[seed] Data loaded."

echo "========================================="
echo "[seed] Pagila sample database ready."
echo "========================================="
