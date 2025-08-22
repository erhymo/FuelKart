"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

interface LogEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const log = doc.data() as Omit<LogEntry, "id">;
          return {
            id: doc.id,
            ...log,
            timestamp: new Date(log.timestamp).toLocaleString(),
          };
        });

        setLogs(data);
      } catch (err) {
        console.error("Kunne ikke hente logger:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Aktivitetslogg</h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl">
        {loading ? (
          <p className="text-gray-500">Laster logg...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">Ingen loggdata tilgjengelig.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="border px-4 py-2 rounded-lg flex justify-between"
              >
                <span>
                  <strong>{log.user}</strong> – {log.action}
                </span>
                <span className="text-gray-500 text-sm">{log.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
