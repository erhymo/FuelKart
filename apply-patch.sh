#!/bin/bash
set -e

PATCH_FILE="toolbar.patch"

if [ ! -f "$PATCH_FILE" ]; then
  echo "❌ Fant ikke $PATCH_FILE i denne mappen."
  exit 1
fi

if [ -f src/app/dashboard/page.tsx ]; then
  echo "📂 Bruker src/app/dashboard/page.tsx"
  patch -p1 < "$PATCH_FILE" --batch --silent
  echo "✅ Patch ferdig brukt på src/app/dashboard/page.tsx!"
elif [ -f app/dashboard/page.tsx ]; then
  echo "📂 Bruker app/dashboard/page.tsx"
  patch -p0 < "$PATCH_FILE" --batch --silent
  echo "✅ Patch ferdig brukt på app/dashboard/page.tsx!"
else
  echo "❌ Ingen gyldig filsti funnet: src/app/dashboard/page.tsx eller app/dashboard/page.tsx"
  exit 1
fi
