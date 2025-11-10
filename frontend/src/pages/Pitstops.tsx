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
  const [drivers, setDrivers] = useState<any[]>([]);
  const [joinResult, setJoinResult] = useState<any[]>([]);

  useEffect(() => {
    // ✅ Fetch Pitstops
    fetch("http://localhost:5000/pitstops")
      .then((res) => res.json())
      .then((data) => setPitstops(data))
      .catch((err) => console.error("Error fetching pitstops:", err));

    // ✅ Fetch Drivers
    fetch("http://localhost:5000/drivers")
      .then((res) => res.json())
      .then((data) => setDrivers(data))
      .catch((err) => console.error("Error fetching drivers:", err));
  }, []);

  // ✅ Run join analytics
  const runJoin = (type: string) => {
    fetch(`http://localhost:5000/join/${type}`)
      .then((res) => res.json())
      .then((data) => setJoinResult(data))
      .catch((err) => console.error(`Error running ${type} join:`, err));
  };

  return (
    <div className="space-y-6 p-6">

      {/* ---------------- HEADER ---------------- */}
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

      

      {/* ---------------- ORIGINAL PITSTOP TABLE (UNCHANGED) ---------------- */}
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

      {/* SPACE BELOW ORIGINAL TABLE */}
      <div className="h-20"></div>

      <h1 className="font-orbitron text-4xl font-bold text-foreground">
          JOIN <span className="text-gradient-racing">ANALYTICS</span>
        </h1>

      {/* ---------------- SIDE-BY-SIDE TABLES ---------------- */}
      <div className="grid grid-cols-2 gap-10">
        <h2 className="text-xl font-bold">Pitstops Table</h2>
        <h2 className="text-xl font-bold">Drivers Table</h2>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-4">

        {/* LEFT – PITSTOP TABLE (DUPLICATED FOR SIDE VIEW) */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pitstop ID</TableHead>
                <TableHead>Tyre</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Lap</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Race</TableHead>
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
        </div>

        {/* RIGHT – DRIVERS TABLE */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => (
                <TableRow key={d.DriverID}>
                  <TableCell>{d.DriverID}</TableCell>
                  <TableCell>{d.FName} {d.LName}</TableCell>
                  <TableCell>{d.TeamID}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>

      {/* ---------------- JOIN ANALYTICS BUTTONS ---------------- */}
      <div className="mt-12 flex gap-4 flex-wrap">
        <button
          onClick={() => runJoin("inner")}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          INNER JOIN – List pitstops with driver identity.
        </button>

        <button
          onClick={() => runJoin("right")}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          RIGHT JOIN – Drivers With a Pitstop
        </button>

        <button
          onClick={() => runJoin("cross")}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          CROSS JOIN – Combinations
        </button>

        <button
          onClick={() => runJoin("self")}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          SELF JOIN – Compare Pitstop Performance
        </button>
      </div>

      {/* ---------------- JOIN RESULTS ---------------- */}
      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-4">Join Results (Table)</h2>

        {joinResult.length > 0 ? (
          <Table className="mb-6">
            <TableHeader>
              <TableRow>
                {Object.keys(joinResult[0]).map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {joinResult.map((row, idx) => (
                <TableRow key={idx}>
                  {Object.values(row).map((value: any, i: number) => (
                    <TableCell key={i}>{String(value)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        ) : (
          <p className="text-muted-foreground">No join results yet.</p>
        )}

        {/* JSON RAW OUTPUT */}
        <h3 className="text-xl font-semibold mt-6 mb-2">Raw JSON Output</h3>
        <pre className="bg-black text-green-400 p-4 rounded-lg overflow-auto max-h-[350px]">
          {JSON.stringify(joinResult, null, 2)}
        </pre>
      </div>

    </div>
  );
};

export default Pitstops;
