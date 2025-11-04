import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "http://localhost:5000";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${API_URL}/drivers`);
        if (!response.ok) throw new Error("Failed to fetch drivers");
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-orbitron text-4xl font-bold text-foreground">
            DRIVERS <span className="text-gradient-racing">MANAGEMENT</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage driver records and team assignments
          </p>
        </div>
        <Button className="gap-2 bg-gradient-racing font-medium racing-glow-sm hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Driver
        </Button>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border bg-card-elevated">
          <div className="overflow-x-auto">
            {loading ? (
              <p className="p-4 text-center text-muted-foreground">
                Loading drivers...
              </p>
            ) : error ? (
              <p className="p-4 text-center text-destructive">❌ {error}</p>
            ) : drivers.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">
                No drivers found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-orbitron text-foreground">ID</TableHead>
                    <TableHead className="font-orbitron text-foreground">Name</TableHead>
                    <TableHead className="font-orbitron text-foreground">Team ID</TableHead>
                    <TableHead className="font-orbitron text-foreground">Nationality</TableHead>
                    <TableHead className="font-orbitron text-foreground">Date of Birth</TableHead>
                    <TableHead className="font-orbitron text-foreground">Age</TableHead>
                    <TableHead className="font-orbitron text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {drivers.map((driver, index) => (
                    <motion.tr
                      key={driver.DriverID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-border transition-colors hover:bg-muted/50"
                    >
                      <TableCell>{driver.DriverID}</TableCell>
                      <TableCell className="font-medium">
                        {driver.FName} {driver.LName}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {driver.TeamID}
                        </span>
                      </TableCell>
                      <TableCell>{driver.Nationality}</TableCell>
                      <TableCell>{formatDate(driver.DOB)}</TableCell>
                      <TableCell>{driver.Age}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </motion.div>

      {/* JOIN CARD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-primary/20 bg-gradient-racing p-6 racing-glow-sm">
          <h3 className="font-orbitron text-lg font-bold text-white">
            JOIN OPERATIONS
          </h3>
          <p className="mt-2 text-sm text-white/80">
            Click "View Team Info" to perform JOIN query between Drivers and Teams tables
          </p>
          <Button
            variant="outline"
            className="mt-4 border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Team Info (JOIN)
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default Drivers;
