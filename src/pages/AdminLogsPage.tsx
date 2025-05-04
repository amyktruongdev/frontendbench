import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { Card, CardContent } from "../components/ui/card";

interface LogEntry {
  id: number;
  user_id: number | null;
  username?: string;
  email?: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await authFetch(`${process.env.REACT_APP_DOMAIN_NAME}api/admin/logs`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch logs");
        }
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || "Error loading logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading logs...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-bold">
        🚫 {error}
      </div>
    );
  }

  return (
    <main className="w-full max-w-6xl mx-auto p-8" role="main" aria-label="System Logs Page">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center" id="admin-logs-heading">
        System Activity Logs
      </h1>

      <section role="region" aria-labelledby="admin-logs-heading" className="grid grid-cols-1 gap-4">
        {logs.map((log) => (
          <Card key={log.id} className="border-gray-300 shadow-md" role="group" aria-label={`Log entry by ${log.username || "Unknown User"}`}>
            <CardContent className="p-4">
              <p><strong>User:</strong> {log.username || "System"} ({log.email || "N/A"})</p>
              <p><strong>Action:</strong> {log.action}</p>
              <p><strong>Details:</strong> {log.details}</p>
              <p><strong>IP Address:</strong> {log.ip_address}</p>
              <p><strong>Timestamp:</strong> {new Date(log.created_at).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
