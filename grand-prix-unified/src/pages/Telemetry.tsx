import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TelemetryData {
  TelemetryID: number;
  Speed: number;
  Throttle: number;
  Brake: number;
  Gear: number;
  RPM: number;
  Timestamp: string;
  LapID: number;
}

const Telemetry = () => {
  const [telemetries, setTelemetries] = useState<TelemetryData[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/telemetries")
      .then((res) => res.json())
      .then((data) => setTelemetries(data))
      .catch((err) => console.error("❌ Error fetching telemetries:", err));
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          TELEMETRY <span className="text-gradient-racing">DATA</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time car performance metrics across laps
        </p>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Speed (km/h)</TableHead>
              <TableHead>Throttle (%)</TableHead>
              <TableHead>Brake (%)</TableHead>
              <TableHead>Gear</TableHead>
              <TableHead>RPM</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Lap ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {telemetries.map((t) => (
              <TableRow key={t.TelemetryID}>
                <TableCell>{t.TelemetryID}</TableCell>
                <TableCell>{t.Speed}</TableCell>
                <TableCell>{t.Throttle}</TableCell>
                <TableCell>{t.Brake}</TableCell>
                <TableCell>{t.Gear}</TableCell>
                <TableCell>{t.RPM}</TableCell>
                <TableCell>
                  {new Date(t.Timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>{t.LapID}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default Telemetry;
