"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

interface Employee {
  id: string;
  name: string;
  pin: string;
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // 🔹 Hent ansatte fra Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      const q = query(collection(db, "employees"), orderBy("name"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Employee, "id">),
      }));
      setEmployees(data);
    };

    fetchEmployees();
  }, []);

  // 🔹 Legg til ansatt
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[0-9]{4}$/.test(pin)) {
      setError("PIN må være nøyaktig 4 tall.");
      return;
    }

    if (employees.some((emp) => emp.pin === pin)) {
      setError("Denne PIN-koden er allerede i bruk.");
      return;
    }

    try {
      await addDoc(collection(db, "employees"), {
        name,
        pin,
      });

      setName("");
      setPin("");
      setError("");

      // Oppdater liste etter lagring
      const q = query(collection(db, "employees"), orderBy("name"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Employee, "id">),
      }));
      setEmployees(data);
    } catch (err) {
      console.error("Feil ved lagring:", err);
      setError("Kunne ikke lagre ansatt.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Meny øverst */}
      <div className="flex space-x-6 mb-8">
        <Link href="/admin-dashboard">
          <span className="text-blue-600 font-semibold cursor-pointer">
            Ansatte
          </span>
        </Link>
        <Link href="/admin-dashboard/logg">
          <span className="text-gray-600 hover:text-blue-600 cursor-pointer">
            Logg
          </span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Legg til ansatt */}
      <form
        onSubmit={handleAddEmployee}
        className="bg-white p-6 rounded-xl shadow-md max-w-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Legg til ansatt</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Fullt navn"
          className="w-full px-4 py-2 border rounded-lg mb-3"
          required
        />

        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="4-sifret PIN"
          maxLength={4}
          className="w-full px-4 py-2 border rounded-lg mb-3"
          required
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Lagre
        </button>
      </form>

      {/* Liste over ansatte */}
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <h2 className="text-xl font-semibold mb-4">Ansatte</h2>
        {employees.length === 0 ? (
          <p className="text-gray-500">Ingen ansatte registrert.</p>
        ) : (
          <ul className="space-y-2">
            {employees.map((emp) => (
              <li
                key={emp.id}
                className="flex justify-between px-4 py-2 border rounded-lg"
              >
                <span>{emp.name}</span>
                <span className="font-mono">{emp.pin}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
