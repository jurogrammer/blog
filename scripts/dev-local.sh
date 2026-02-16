#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-1313}"
HUGO_BIN="${HUGO_BIN:-hugo}"
BASE_URL="http://localhost:${PORT}/blog/"

if ! command -v "$HUGO_BIN" >/dev/null 2>&1; then
  if [[ -x "/tmp/hugo-bin/hugo" ]]; then
    HUGO_BIN="/tmp/hugo-bin/hugo"
  else
    echo "hugo binary not found. Install Hugo or set HUGO_BIN."
    exit 1
  fi
fi

exec "$HUGO_BIN" server \
  --config hugo.toml,hugo.local.toml \
  --baseURL "$BASE_URL" \
  --disableFastRender \
  --bind 127.0.0.1 \
  --port "$PORT"
