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
import { Timer, Trophy, User, Calendar, PlusCircle } from "lucide-react";

const Laps = () => {
  const [laps, setLaps] = useState([]);
  const [logs, setLogs] = useState<string[]>([]); // for lap logger messages
  const [isAdding, setIsAdding] = useState(false);

  // Fetch laps initially
  useEffect(() => {
    fetch("http://localhost:5000/laps")
      .then((res) => res.json())
      .then((data) => setLaps(data))
      .catch((err) => console.error("❌ Error fetching laps:", err));
  }, []);

  // ✅ Add a new lap (simulate insert + log message)
  const handleAddLap = async () => {
    setIsAdding(true);

    try {
      // For demo, pick a random driver/race to add a new lap
      const newLap = {
        LapNo: laps.length + 1,
        Laptime: (1.40 + Math.random() * 0.1).toFixed(3),
        Position: Math.floor(Math.random() * 5) + 1,
        DriverID: Math.floor(Math.random() * 5) + 1,
        RaceID: Math.floor(Math.random() * 5) + 1,
      };

      const res = await fetch("http://localhost:5000/laps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLap),
      });

      if (!res.ok) throw new Error("Failed to add lap");

      // Refresh laps list
      const updated = await fetch("http://localhost:5000/laps").then((r) =>
        r.json()
      );
      setLaps(updated);

      // Add a message to the Lap Logger
      const msg = `> New Lap Added: LapNo ${newLap.LapNo} by Driver ${newLap.DriverID} in Race ${newLap.RaceID} (${newLap.Laptime} min)`;
      setLogs((prev) => [msg, ...prev]);

      console.log("✅ Lap added successfully:", newLap);
    } catch (err) {
      console.error("❌ Error adding lap:", err);
      setLogs((prev) => ["> Error adding new lap ❌", ...prev]);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-orbitron text-4xl font-bold text-foreground">
            LAPS <span className="text-gradient-racing">ANALYSIS</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Detailed overview of each lap — lap time, driver, and position.
            It simulates how, in an F1 race, every time a driver completes a lap, a new lap record is automatically added to the `lap` table — and a database trigger instantly logs that event into the `lap_log` table, capturing real-time race telemetry like lap number, driver, and race ID without needing manual input.

          </p>
        </div>

        {/* Add Lap Button */}
        <button
          onClick={handleAddLap}
          disabled={isAdding}
          className="flex items-center gap-2 bg-black text-white border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all font-mono"
        >
          <PlusCircle className="h-5 w-5 text-red-400" />
          {isAdding ? "ADDING..." : "ADD LAP"}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border shadow-md overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-center w-[10%]">Lap No</TableHead>
              <TableHead className="text-center w-[20%]">
                Lap Time (min)
              </TableHead>
              <TableHead className="text-center w-[15%]">Position</TableHead>
              <TableHead className="text-center w-[25%]">Driver ID</TableHead>
              <TableHead className="text-center w-[20%]">Race ID</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {laps.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  No lap data available
                </TableCell>
              </TableRow>
            ) : (
              laps.map((lap, index) => (
                <motion.tr
                  key={`${lap.LapNo}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50 border-border transition-colors"
                >
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span>{lap.LapNo ?? "N/A"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {typeof lap.Laptime === "number"
                          ? lap.Laptime.toFixed(3)
                          : lap.Laptime ?? "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    {lap.Position ?? "N/A"}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{lap.DriverID ?? "N/A"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{lap.RaceID ?? "N/A"}</span>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Lap Logger Console */}
      <div className="mt-10 rounded-xl border border-red-500 bg-black p-4 font-mono text-sm text-green-400 shadow-inner max-h-[250px] overflow-y-auto">
        <h2 className="font-orbitron text-xl text-red-400 mb-2">
          LAP LOGGER CONSOLE
        </h2>
        {logs.length === 0 ? (
          <p className="text-neutral-500"> Waiting for new lap entries...</p>
        ) : (
          logs.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </motion.div>
  );
};

export default Laps;
