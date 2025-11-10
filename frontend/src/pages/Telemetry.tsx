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
import { RadialGauge } from "react-canvas-gauges";

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
  const [latest, setLatest] = useState<TelemetryData | null>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch("http://localhost:5000/telemetries");
        const data = await res.json();
        setTelemetries(data);
        if (data.length > 0) setLatest(data[data.length - 1]);
      } catch (err) {
        console.error("❌ Error fetching telemetries:", err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          TELEMETRY <span className="text-gradient-racing">DATA</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time car performance metrics across laps
        </p>
      </motion.div>

      {/* Gauges Dashboard */}
      {latest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-10 bg-card-elevated border border-border rounded-xl p-6"
        >
          {/* SPEED GAUGE 🚀 */}
          <motion.div
            animate={{
              boxShadow:
                latest.Speed > 300
                  ? "0 0 40px 10px rgba(0,162,255,0.8)" // 💙 intense blue glow
                  : latest.Speed > 200
                  ? "0 0 25px 5px rgba(0,255,255,0.5)" // cyan for mid-speed
                  : "0 0 0 rgba(0,0,0,0)", // no glow
            }}
            transition={{ duration: 0.4 }}
            className="rounded-full p-2"
          >
            <RadialGauge
              units="km/h"
              title="Speed"
              value={latest.Speed}
              minValue={0}
              maxValue={350}
              majorTicks={["0", "50", "100", "150", "200", "250", "300", "350"]}
              highlights={[
                { from: 0, to: 150, color: "rgba(0,255,0,.3)" },
                { from: 150, to: 250, color: "rgba(255,255,0,.3)" },
                { from: 250, to: 350, color: "rgba(255,0,0,.3)" },
              ]}
              colorPlate="#111"
              colorMajorTicks="#ddd"
              colorNumbers="#eee"
              colorTitle="#fff"
              borders={false}
              valueBox
              animationRule="elastic"
              animationDuration={1000}
              animationTarget="needle"
              width={250}
              height={250}
            />
          </motion.div>

          {/* RPM GAUGE 🔥 */}
          <motion.div
            animate={{
              boxShadow:
                latest.RPM > 9000
                  ? "0 0 40px 10px rgba(255,0,0,0.7)" // 🔥 red glow at high revs
                  : latest.RPM > 6000
                  ? "0 0 25px 5px rgba(255,165,0,0.6)" // 🟠 orange mid revs
                  : "0 0 0px rgba(0,0,0,0)", // no glow
            }}
            transition={{
              repeat: latest.RPM > 9000 ? Infinity : 0,
              repeatType: "mirror",
              duration: 0.6,
            }}
            className="rounded-full p-2"
          >
            <RadialGauge
              units="RPM"
              title="Engine RPM"
              value={latest.RPM}
              minValue={0}
              maxValue={12000}
              majorTicks={["0", "2000", "4000", "6000", "8000", "10000", "12000"]}
              highlights={[
                { from: 0, to: 6000, color: "rgba(0,255,0,.3)" },
                { from: 6000, to: 9000, color: "rgba(255,255,0,.3)" },
                { from: 9000, to: 12000, color: "rgba(255,0,0,.4)" },
              ]}
              colorPlate="#111"
              colorMajorTicks="#ddd"
              colorNumbers="#eee"
              colorTitle="#fff"
              borders={false}
              valueBox
              animationRule="bounce"
              animationDuration={1200}
              animationTarget="needle"
              width={250}
              height={250}
            />
          </motion.div>

          {/* GEAR GAUGE ⚙️ */}
          <motion.div
            animate={{
              boxShadow:
                latest.Gear >= 7
                  ? "0 0 35px 8px rgba(255,255,255,0.8)" // ⚪ bright white for top gear
                  : latest.Gear >= 4
                  ? "0 0 20px 5px rgba(0,255,150,0.6)" // 🟢 mid gear glow
                  : "0 0 0 rgba(0,0,0,0)", // idle
            }}
            transition={{ duration: 0.3 }}
            className="rounded-full p-2"
          >
            <RadialGauge
              title="Gear"
              value={latest.Gear}
              minValue={0}
              maxValue={8}
              majorTicks={["N", "1", "2", "3", "4", "5", "6", "7", "8"]}
              colorPlate="#111"
              colorMajorTicks="#ddd"
              colorNumbers="#eee"
              colorTitle="#fff"
              borders={false}
              valueBox
              animationRule="linear"
              animationDuration={500}
              animationTarget="needle"
              width={250}
              height={250}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Data Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
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
                <TableCell>{new Date(t.Timestamp).toLocaleTimeString()}</TableCell>
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
