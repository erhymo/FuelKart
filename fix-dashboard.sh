#!/bin/bash
set -e

echo "🔧 Oppdaterer page.tsx med ikoner og popup-flyt..."

cat > src/app/dashboard/page.tsx << 'EOT'
"use client";

import { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Depot-typer
type DepotType = "base" | "fuel" | "helipad";

interface Depot {
  id: string;
  name: string;
  type: DepotType;
  lat: number;
  lng: number;
  full: number;
  empty: number;
  equipment: string[];
}

export default function DashboardPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [depots, setDepots] = useState<Depot[]>([
    {
      id: "1",
      name: "Bringeland Base",
      type: "base",
      lat: 61.3,
      lng: 5.0,
      full: 0,
      empty: 0,
      equipment: ["Hangar", "Brannbil"],
    },
    {
      id: "2",
      name: "Fjell Fuel Depot",
      type: "fuel",
      lat: 61.4,
      lng: 5.2,
      full: 6,
      empty: 2,
      equipment: ["Brakke", "Betongvekt"],
    },
    {
      id: "3",
      name: "Sogne Helipad",
      type: "helipad",
      lat: 61.2,
      lng: 5.1,
      full: 0,
      empty: 0,
      equipment: ["Lys", "Skilt"],
    },
  ]);
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null);
  const [editMode, setEditMode] = useState(false);

  if (!isLoaded) return <div>Laster kart...</div>;

  // Lagre depot
  const handleSave = (updated: Depot) => {
    setDepots(depots.map(d => (d.id === updated.id ? updated : d)));
    setSelectedDepot(null);
    setEditMode(false);
  };

  // Slett depot
  const handleDelete = (id: string) => {
    setDepots(depots.filter(d => d.id !== id));
    setSelectedDepot(null);
    setEditMode(false);
  };

  // Velg ikon
  const getIcon = (type: DepotType) => {
    if (type === "base") {
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    } else if (type === "fuel") {
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    } else if (type === "helipad") {
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
    return undefined;
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat: 61.3, lng: 5.1 }}
        zoom={9}
      >
        {depots.map(depot => (
          <Marker
            key={depot.id}
            position={{ lat: depot.lat, lng: depot.lng }}
            icon={getIcon(depot.type)}
            onClick={() => {
              setSelectedDepot(depot);
              setEditMode(false);
            }}
          />
        ))}
      </GoogleMap>

      {/* Popup for info */}
      {selectedDepot && !editMode && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            width: "320px",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
            {selectedDepot.name}
          </h2>
          <p style={{ fontSize: "26px" }}>F: {selectedDepot.full}</p>
          <p style={{ fontSize: "26px" }}>T: {selectedDepot.empty}</p>
          <div>
            {selectedDepot.equipment.slice(0, 4).map((eq, i) => (
              <p key={i}>{eq}</p>
            ))}
            {selectedDepot.equipment.length > 4 && (
              <button
                style={{
                  marginTop: "5px",
                  background: "#eee",
                  padding: "5px",
                  borderRadius: "6px",
                }}
              >
                Vis mer
              </button>
            )}
          </div>
          <button
            onClick={() => setEditMode(true)}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              background: "blue",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Rediger
          </button>
        </div>
      )}

      {/* Popup for redigering */}
      {selectedDepot && editMode && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            width: "340px",
            zIndex: 1000,
          }}
        >
          <h2 style={{ textAlign: "center", fontSize: "22px" }}>
            {selectedDepot.name}
          </h2>
          <button
            onClick={() => setSelectedDepot(null)}
            style={{ display: "block", margin: "10px auto" }}
          >
            Avslutt
          </button>

          <div style={{ fontSize: "22px", margin: "10px 0" }}>
            Fulle fat: {selectedDepot.full}{" "}
            <button
              onClick={() =>
                setSelectedDepot({
                  ...selectedDepot,
                  full: Math.max(0, selectedDepot.full - 1),
                  empty: selectedDepot.empty + 1,
                })
              }
            >
              -
            </button>
          </div>
          <div style={{ fontSize: "22px", margin: "10px 0" }}>
            Tomme fat: {selectedDepot.empty}
          </div>

          <div style={{ margin: "10px 0" }}>
            <p>Utstyr:</p>
            {selectedDepot.equipment.map((eq, i) => (
              <p key={i}>{eq}</p>
            ))}
            <button
              onClick={() =>
                setSelectedDepot({
                  ...selectedDepot,
                  equipment: [...selectedDepot.equipment, "Nytt utstyr"],
                })
              }
            >
              + Legg til utstyr
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => handleSave(selectedDepot)}
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              Lagre
            </button>
            <button
              onClick={() => handleDelete(selectedDepot.id)}
              style={{
                background: "red",
                color: "white",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            >
              Slett
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
EOT

echo "✅ Ferdig! Prøv npm run dev og test ikoner + popup-flyt."
