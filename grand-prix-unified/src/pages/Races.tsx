import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CalendarDays, MapPin, Cloud } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Race {
  RaceID: number;
  Circuit: string;
  Date: string;
  Weather: string;
}

const Races = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch race data from backend
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch("http://localhost:5000/races");
        if (!response.ok) throw new Error("Failed to fetch races");
        const data = await response.json();
        setRaces(data);
      } catch (err) {
        console.error("Error fetching races:", err);
        setError("Failed to load race data");
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  // Analytics
  const totalRaces = races.length;
  const earliestRace =
    races.length > 0
      ? new Date(
          Math.min(...races.map((r) => new Date(r.Date).getTime()))
        ).toLocaleDateString()
      : "N/A";
  const latestRace =
    races.length > 0
      ? new Date(
          Math.max(...races.map((r) => new Date(r.Date).getTime()))
        ).toLocaleDateString()
      : "N/A";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-orbitron text-4xl font-bold text-foreground">
            RACES <span className="text-gradient-racing">SCHEDULE</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage race calendar, venues, and statistics
          </p>
        </div>
        <Button className="gap-2 bg-gradient-racing font-medium racing-glow-sm hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Race
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border bg-card-elevated">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground">
                Loading race data...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-destructive">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-orbitron text-foreground">ID</TableHead>
                    <TableHead className="font-orbitron text-foreground">Circuit</TableHead>
                    <TableHead className="font-orbitron text-foreground">Date</TableHead>
                    <TableHead className="font-orbitron text-foreground">Weather</TableHead>
                    <TableHead className="font-orbitron text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {races.map((race, index) => (
                    <motion.tr
                      key={race.RaceID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-border transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{race.RaceID}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        {race.Circuit}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {new Date(race.Date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                        {race.Weather}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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

      {/* Analytics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-accent/20 bg-card-elevated p-6">
          <h3 className="font-orbitron text-lg font-bold text-foreground">
            RACE <span className="text-accent">ANALYTICS</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Race statistics aggregated using SQL and frontend analysis
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Total Races</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">{totalRaces}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Earliest Race</p>
              <p className="mt-1 font-orbitron text-xl font-bold text-accent">{earliestRace}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Latest Race</p>
              <p className="mt-1 font-orbitron text-xl font-bold text-accent">{latestRace}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Races;
