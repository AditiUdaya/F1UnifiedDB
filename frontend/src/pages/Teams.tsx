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
  AvgDriverAge?: number | null;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [analytics, setAnalytics] = useState({
    YoungestTeamAvg: null,
    OldestTeamAvg: null,
    OverallAvg: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch teams + analytics + driver averages
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/teams");
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        setTeams(data);

        // ✅ Fetch analytics
        const analyticsRes = await fetch("http://localhost:5000/teams/analytics");
        const analyticsData = await analyticsRes.json();
        setAnalytics({
          YoungestTeamAvg:
            analyticsData.YoungestTeamAvg != null
              ? Number(analyticsData.YoungestTeamAvg)
              : null,
          OldestTeamAvg:
            analyticsData.OldestTeamAvg != null
              ? Number(analyticsData.OldestTeamAvg)
              : null,
          OverallAvg:
            analyticsData.OverallAvg != null
              ? Number(analyticsData.OverallAvg)
              : null,
        });

        // ✅ Fetch driver averages
        fetchDriverAverages();
      } catch (err) {
        console.error("Error fetching teams or analytics:", err);
        setError("Failed to load team or analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();

    // ✅ Auto-refresh analytics + driver averages every 5s
    const interval = setInterval(() => {
      fetchTeams();
      fetchDriverAverages();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Compute per-team average driver ages (frontend only)
  const fetchDriverAverages = async () => {
    try {
      const res = await fetch("http://localhost:5000/drivers");
      const drivers = await res.json();

      // Group drivers by team and compute averages
      const teamAverages = drivers.reduce((acc: any, d: any) => {
        if (!d.TeamID) return acc;
        if (!acc[d.TeamID]) acc[d.TeamID] = [];
        acc[d.TeamID].push(d.Age);
        return acc;
      }, {});

      // Update teams with computed averages
      setTeams((prev) =>
        prev.map((t) => ({
          ...t,
          AvgDriverAge: teamAverages[t.TeamID]
            ? teamAverages[t.TeamID].reduce((a: number, b: number) => a + b, 0) /
              teamAverages[t.TeamID].length
            : null,
        }))
      );
    } catch (err) {
      console.error("Error fetching driver averages:", err);
    }
  };

  // ✅ Delete team handler
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      const response = await fetch(`http://localhost:5000/teams/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`❌ Failed to delete team: ${err.error || "Unknown error"}`);
        return;
      }

      // Remove deleted team from UI instantly
      setTeams((prev) => prev.filter((team) => team.TeamID !== id));
      alert("✅ Team deleted successfully!");
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("❌ Failed to delete team. Check server logs.");
    }
  };

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
            Manage constructor teams and statistics:  Team and driver data are linked using a LEFT JOIN, ensuring all teams appear even if they have no assigned drivers.
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
                        {team.AvgDriverAge != null && !isNaN(Number(team.AvgDriverAge)) ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                            <Users className="h-3 w-3" />
                            {Number(team.AvgDriverAge).toFixed(1)} years
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
                            
                            <Trash2 className="h-4 w-4 text-destructive" />
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
                {analytics.YoungestTeamAvg != null
                  ? `${analytics.YoungestTeamAvg.toFixed(1)} years`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Oldest Team Avg</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">
                {analytics.OldestTeamAvg != null
                  ? `${analytics.OldestTeamAvg.toFixed(1)} years`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Overall Avg</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">
                {analytics.OverallAvg != null
                  ? `${analytics.OverallAvg.toFixed(1)} years`
                  : "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Teams;
