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

interface Pitstop {
  PitstopID: number;
  TyreCompound: string;
  Duration: number;
  LapNo: number;
  DriverID: number;
  RaceID: number;
}

const Pitstops = () => {
  const [pitstops, setPitstops] = useState<Pitstop[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/pitstops")
      .then((res) => res.json())
      .then((data) => setPitstops(data))
      .catch((err) => console.error("Error fetching pitstops:", err));
  }, []);

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          PITSTOPS <span className="text-gradient-racing">TRACKING</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time pitstop data for each driver
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pitstop ID</TableHead>
              <TableHead>Tyre Compound</TableHead>
              <TableHead>Duration (s)</TableHead>
              <TableHead>Lap No</TableHead>
              <TableHead>Driver ID</TableHead>
              <TableHead>Race ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pitstops.map((pit) => (
              <TableRow key={pit.PitstopID}>
                <TableCell>{pit.PitstopID}</TableCell>
                <TableCell>{pit.TyreCompound}</TableCell>
                <TableCell>{pit.Duration}</TableCell>
                <TableCell>{pit.LapNo}</TableCell>
                <TableCell>{pit.DriverID}</TableCell>
                <TableCell>{pit.RaceID}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default Pitstops;
