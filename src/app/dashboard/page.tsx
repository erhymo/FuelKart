"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type DepotType = "fueldepot" | "base" | "helipad";

interface Depot {
  id: string;
  type: DepotType;
  name: string;
  lat: number;
  lng: number;
  full: number;
  empty: number;
  equipment: string[];
}

export default function DashboardPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  // Depoter lagres i state
  const [depots, setDepots] = useState<Depot[]>([]);
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null);
  const [creatingType, setCreatingType] = useState<DepotType | null>(null);

  // Google Maps load state
  const [googleReady, setGoogleReady] = useState(false);

  // 👇 Testlogg slik at du ser patchen fungerte
  useEffect(() => {
    console.log("✅ DashboardPage lastet inn!");
  }, []);

  // Init kart når Google er klart
  useEffect(() => {
    if (googleReady && mapRef.current && !mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: 60.472, lng: 8.4689 },
        zoom: 6,
      });

      // Klikk for å lage depot
      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (creatingType && e.latLng) {
          const newDepot: Depot = {
            id: Date.now().toString(),
            type: creatingType,
            name: creatingType === "fueldepot" ? "Nytt depot" : creatingType,
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            full: 0,
            empty: 0,
            equipment: [],
          };
          setDepots((prev) => [...prev, newDepot]);
          setCreatingType(null);
        } else {
          setSelectedDepot(null);
        }
      });
    }
  }, [googleReady, creatingType]);

  // Render markers
  useEffect(() => {
    if (!mapInstance.current) return;

    depots.forEach((depot) => {
      const marker = new google.maps.Marker({
        position: { lat: depot.lat, lng: depot.lng },
        map: mapInstance.current!,
        icon:
          depot.type === "fueldepot"
            ? "/icons/fueldepot.svg"
            : depot.type === "helipad"
            ? "/icons/helipad.svg"
            : "/icons/base.svg",
      });

      marker.addListener("click", () => {
        setSelectedDepot(depot);
      });
    });
  }, [depots]);

  // Rediger depot
  const updateDepot = (updated: Depot) => {
    setDepots((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDepot(updated);
  };

  // Slett depot
  const deleteDepot = (id: string) => {
    setDepots((prev) => prev.filter((d) => d.id !== id));
    setSelectedDepot(null);
  };

  return (
    <>
      {/* Toolbar med meny og add-knapp */}
      <div className="absolute top-4 left-4 z-10 flex gap-3 items-center">
        {/* Dropdown for valg */}
        <select
          className="bg-white rounded-full shadow-md border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setCreatingType(e.target.value as DepotType)}
          value={creatingType ?? ""}
        >
          <option value="">Velg type</option>
          <option value="fueldepot">⛽ Fueldepot</option>
          <option value="base">🏠 Base</option>
          <option value="helipad">🚁 Helipad</option>
        </select>
        {/* Pluss-knapp */}
        <button
          onClick={() => {
            if (!creatingType) {
              alert("Velg type først!");
              return;
            }
            alert("Klikk på kartet for å plassere depotet");
          }}
          className="bg-green-500 hover:bg-green-600 transition text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-md"
        >
          +
        </button>
      </div>      {/* Google Maps API script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        strategy="afterInteractive"
        onLoad={() => setGoogleReady(true)}
      />

      {/* Info-popup */}
      {selectedDepot && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 bg-white shadow-lg p-4 rounded w-80">
          <h2 className="text-lg font-bold mb-2">{selectedDepot.name}</h2>

          <label className="block mb-1">Fulle fat</label>
          <input
            type="number"
            value={selectedDepot.full}
            onChange={(e) =>
              updateDepot({ ...selectedDepot, full: parseInt(e.target.value) || 0 })
            }
            className="border p-1 w-full mb-2"
          />

          <label className="block mb-1">Tomme fat</label>
          <input
            type="number"
            value={selectedDepot.empty}
            onChange={(e) =>
              updateDepot({ ...selectedDepot, empty: parseInt(e.target.value) || 0 })
            }
            className="border p-1 w-full mb-2"
          />

          <label className="block mb-1">Utstyr</label>
          {selectedDepot.equipment.map((eq, i) => (
            <input
              key={i}
              type="text"
              value={eq}
              onChange={(e) => {
                const eqCopy = [...selectedDepot.equipment];
                eqCopy[i] = e.target.value;
                updateDepot({ ...selectedDepot, equipment: eqCopy });
              }}
              className="border p-1 w-full mb-1"
            />
          ))}
          <button
            onClick={() =>
              updateDepot({
                ...selectedDepot,
                equipment: [...selectedDepot.equipment, ""],
              })
            }
            className="bg-gray-200 px-2 py-1 rounded mb-2"
          >
            + Utstyr
          </button>

          <div className="flex justify-between">
            <button
              onClick={() => updateDepot(selectedDepot)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lagre
            </button>
            <button
              onClick={() => {
                if (confirm("Vil du slette dette depotet?")) {
                  deleteDepot(selectedDepot.id);
                }
              }}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              Slett
            </button>
          </div>
        </div>
      )}

      {/* Kart */}
      <div ref={mapRef} className="w-full h-screen" />
    </>
  );
}
