#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# UI/source leak scan — folder name workdayforge is excluded by scoping to src/
if rg -n 'Workday|WorkForge|\bSana\b' src README.md package.json 2>/dev/null; then
  echo "Brand leak scan FAILED"
  exit 1
fi
echo "Brand leak scan CLEAN (src + README + package.json)"
