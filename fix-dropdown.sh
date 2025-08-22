#!/bin/bash
set -e

echo "🔧 Oppdaterer <option>-delen i dashboard..."

awk '
/<option key={depot.id}>/ {
  print "          <option key={depot.id}>"
  print "            {depot.name} | {depot.type === \\\"base\\\" ? \\\"🚁\\\" : depot.type === \\\"depot\\\" ? \\\"🛢️\\\" : \\\"🟨H\\\"} | F:{depot.fullBarrels} / T:{depot.emptyBarrels}"
  print "          </option>"
  next
}
{print}
' src/app/dashboard/page.tsx > src/app/dashboard/page_fixed.tsx

mv src/app/dashboard/page_fixed.tsx src/app/dashboard/page.tsx

echo "✅ Ferdig! Nå viser dropdown navn + ikon + fulle/tomme fat."
