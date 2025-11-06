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
import { Timer, Trophy, User, Calendar } from "lucide-react";

const Laps = () => {
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/laps")
      .then((res) => res.json())
      .then((data) => setLaps(data))
      .catch((err) => console.error("❌ Error fetching laps:", err));
  }, []);

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          LAPS <span className="text-gradient-racing">ANALYSIS</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Detailed overview of each lap — lap time, driver, and position.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border shadow-md overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-center w-[10%]">Lap No</TableHead>
              <TableHead className="text-center w-[20%]">Lap Time (min)</TableHead>
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
    </motion.div>
  );
};

export default Laps;
