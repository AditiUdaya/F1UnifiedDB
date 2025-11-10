import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, Wifi, Activity } from "lucide-react";

export const StatusBar = () => {
  const [status, setStatus] = useState({
    connected: false,
    database: "f1UnifiedDB",
  });

  // 🔁 Check backend /status every 5 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/status");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        setStatus({ connected: false, database: "f1UnifiedDB" });
      }
    };

    fetchStatus(); // run immediately
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-10 border-t border-border bg-card/80 backdrop-blur-sm"
    >
      <div className="flex h-full items-center justify-between px-6 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Database:</span>
            <span className="font-medium text-foreground">{status.database}</span>

            {status.connected ? (
              <div className="ml-2 flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5">
                <div className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-primary" />
                <span className="text-primary">Connected</span>
              </div>
            ) : (
              <div className="ml-2 flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-red-500">Disconnected</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Wifi
              className={`h-3.5 w-3.5 ${
                status.connected ? "text-accent" : "text-red-500"
              }`}
            />
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`font-medium ${
                status.connected ? "text-accent" : "text-red-500"
              }`}
            >
              {status.connected ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-silver" />
          <span className="text-muted-foreground">System Active</span>
        </div>
      </div>
    </motion.div>
  );
};
