"use client";

import React from "react";

export default function MapControls({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-3 z-10">
      {/* Meny-knapp */}
      <button className="bg-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center">
        <span className="text-2xl">☰</span>
      </button>

      {/* Pluss-knapp */}
      <button
        onClick={onAdd}
        className="bg-green-500 text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center text-3xl"
      >
        +
      </button>
    </div>
  );
}
