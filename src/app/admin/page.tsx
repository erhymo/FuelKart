"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === adminPassword) {
      setError("");
      router.push("/admin-dashboard"); // sender admin til admin dashboard
    } else {
      setError("Feil passord. Prøv igjen.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/airlift-logo.png" // legg logoen i public/
            alt="Airlift Logo"
            width={160}
            height={80}
          />
        </div>

        {/* Passord form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Skriv inn admin-passord"
            className="w-full px-4 py-3 border rounded-lg text-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Logg inn
          </button>
        </form>
      </div>
    </div>
  );
}
