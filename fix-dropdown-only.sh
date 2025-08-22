#!/bin/bash
set -e

echo "🔧 Fikser dropdown-koden i page.tsx..."

sed -i.bak '/<select/,/<\/select>/c\
      <select className="border p-2 rounded w-full">\
        {depots.map((depot) => (\
          <option key={depot.id}>\
            {depot.name} | {depot.type === "base" ? "🚁" : depot.type === "depot" ? "🛢" : "🟡H"} | \
            F:{depot.fullBarrels ?? 0} / T:{depot.emptyBarrels ?? 0}\
          </option>\
        ))}\
      </select>' src/app/dashboard/page.tsx

echo "✅ Dropdown er oppdatert!"
