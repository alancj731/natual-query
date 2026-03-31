#!/bin/bash
set -e

echo "========================================="
echo "[init] Loading Pagila schema..."
echo "========================================="
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/01-pagila-schema.sql
echo "[init] Schema loaded successfully."

echo "========================================="
echo "[init] Loading Pagila data..."
echo "========================================="
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/02-pagila-data.sql
echo "[init] Data loaded successfully."

echo "========================================="
echo "[init] Pagila sample database ready."
echo "========================================="
