import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TypeScript interface for clarity
interface Team {
  TeamID: number;
  TeamName: string;
  BaseCountry: string;
  AvgDriverAge?: number;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams from backend
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/teams");
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Helper analytics
  const avgAges = teams.map((t) => t.AvgDriverAge ?? 0);
  const youngest = avgAges.length ? Math.min(...avgAges) : 0;
  const oldest = avgAges.length ? Math.max(...avgAges) : 0;
  const overall =
    avgAges.length && avgAges.reduce((a, b) => a + b, 0) / avgAges.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-orbitron text-4xl font-bold text-foreground">
            TEAMS <span className="text-gradient-racing">MANAGEMENT</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage constructor teams and statistics
          </p>
        </div>

        <Button className="gap-2 bg-gradient-racing font-medium racing-glow-sm hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border bg-card-elevated">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground">
                Loading team data...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-destructive">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-orbitron text-foreground">
                      ID
                    </TableHead>
                    <TableHead className="font-orbitron text-foreground">
                      Team Name
                    </TableHead>
                    <TableHead className="font-orbitron text-foreground">
                      Base Country
                    </TableHead>
                    <TableHead className="font-orbitron text-foreground">
                      Avg Driver Age
                    </TableHead>
                    <TableHead className="font-orbitron text-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {teams.map((team, index) => (
                    <motion.tr
                      key={team.TeamID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-border transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {team.TeamID}
                      </TableCell>
                      <TableCell className="font-medium">
                        {team.TeamName}
                      </TableCell>
                      <TableCell>{team.BaseCountry}</TableCell>
                      <TableCell>
                        {team.AvgDriverAge ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                            <Users className="h-3 w-3" />
                            {team.AvgDriverAge.toFixed(1)} years
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
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

      {/* Aggregate Analytics Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-accent/20 bg-card-elevated p-6">
          <h3 className="font-orbitron text-lg font-bold text-foreground">
            AGGREGATE <span className="text-accent">ANALYTICS</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Average driver age calculated using SQL aggregate functions (AVG, GROUP BY)
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Youngest Team Avg</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">
                {youngest ? `${youngest.toFixed(1)} years` : "N/A"}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Oldest Team Avg</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">
                {oldest ? `${oldest.toFixed(1)} years` : "N/A"}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Overall Avg</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">
                {overall ? `${overall.toFixed(1)} years` : "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Teams;
