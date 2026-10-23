#!/usr/bin/env bash
# Fails if the service-role key value appears in client-visible build output,
# or if a client component imports the admin client.
set -euo pipefail
cd "$(dirname "$0")/.."

key="${SUPABASE_SERVICE_ROLE_KEY:-}"
if [ -n "$key" ] && [ -d .next/static ] && grep -rqF -- "$key" .next/static; then
  echo "FAIL: service role key found in .next/static" >&2
  exit 1
fi

bad=$(grep -rl --include='*.ts' --include='*.tsx' -e 'supabase/admin' -e 'seed/demo-seed' src \
  | xargs -I{} sh -c 'head -n 3 "{}" | grep -q "use client" && echo "{}"' || true)
if [ -n "$bad" ]; then
  echo "FAIL: client components import server-only Supabase code:" >&2
  echo "$bad" >&2
  exit 1
fi
echo "Bundle secret check CLEAN"
