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

const teamsData = [
  { id: 1, name: "Red Bull Racing", baseCountry: "Austria", avgDriverAge: 26.5 },
  { id: 2, name: "Ferrari", baseCountry: "Italy", avgDriverAge: 27.5 },
  { id: 3, name: "Mercedes", baseCountry: "Germany", avgDriverAge: 32.0 },
  { id: 4, name: "McLaren", baseCountry: "United Kingdom", avgDriverAge: 25.5 },
  { id: 5, name: "Aston Martin", baseCountry: "United Kingdom", avgDriverAge: 35.0 },
];

const Teams = () => {
  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-orbitron text-4xl font-bold text-foreground">
            TEAMS <span className="text-gradient-racing">MANAGEMENT</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Manage constructor teams and statistics</p>
        </div>
        
        <Button className="gap-2 bg-gradient-racing font-medium racing-glow-sm hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border bg-card-elevated">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-orbitron text-foreground">ID</TableHead>
                  <TableHead className="font-orbitron text-foreground">Team Name</TableHead>
                  <TableHead className="font-orbitron text-foreground">Base Country</TableHead>
                  <TableHead className="font-orbitron text-foreground">Avg Driver Age</TableHead>
                  <TableHead className="font-orbitron text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamsData.map((team, index) => (
                  <motion.tr
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-border transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{team.id}</TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.baseCountry}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                        <Users className="h-3 w-3" />
                        {team.avgDriverAge} years
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>

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
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">25.5 years</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Oldest Team Avg</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">35.0 years</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Overall Avg</p>
              <p className="mt-1 font-orbitron text-2xl font-bold text-accent">29.3 years</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Teams;
