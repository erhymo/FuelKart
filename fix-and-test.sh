#!/bin/bash
set -e

echo "🔧 Steg 1: Oppdaterer dropdown-koden i page.tsx..."
cat > src/app/dashboard/page.tsx << 'EOT'
"use client";

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const [depots, setDepots] = useState<any[]>([]);

  useEffect(() => {
    async function loadDepots() {
      const snapshot = await getDocs(collection(db, "depots"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDepots(data);
    }
    loadDepots();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Alle depoter:</h1>
      <select className="border p-2 rounded w-full">
        {depots.map((depot) => (
          <option key={depot.id}>
            {depot.name} | {depot.type === "base" ? "🚁" : depot.type === "depot" ? "🛢" : "🟡H"} | 
            F:{depot.fullBarrels ?? 0} / T:{depot.emptyBarrels ?? 0}
          </option>
        ))}
      </select>
    </div>
  );
}
EOT

echo "✅ Koden er oppdatert!"

echo "🚀 Steg 2: Starter dev-server..."
npm run dev
