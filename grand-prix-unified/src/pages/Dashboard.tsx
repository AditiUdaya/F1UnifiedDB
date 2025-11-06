import { motion } from "framer-motion";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { F1CarScene } from "@/components/dashboard/F1CarScene";
import { Users, Trophy, Flag, Timer, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const performanceData = [
  { lap: 1, time: 95.2 },
  { lap: 2, time: 92.8 },
  { lap: 3, time: 91.5 },
  { lap: 4, time: 90.9 },
  { lap: 5, time: 90.2 },
  { lap: 6, time: 89.8 },
];

const teamData = [
  { team: "Ferrari", points: 285 },
  { team: "Mercedes", points: 268 },
  { team: "Red Bull", points: 312 },
  { team: "McLaren", points: 195 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          DASHBOARD <span className="text-gradient-racing">OVERVIEW</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Real-time Formula 1 data analytics and insights</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Drivers"
          value="20"
          icon={Users}
          trend="Active this season"
          delay={0.1}
        />
        <MetricCard
          title="Total Teams"
          value="10"
          icon={Trophy}
          trend="Competing teams"
          delay={0.2}
        />
        <MetricCard
          title="Races Completed"
          value="8"
          icon={Flag}
          trend="Out of 22"
          delay={0.3}
        />
        <MetricCard
          title="Fastest Lap"
          value="1:18.446"
          icon={Timer}
          trend="Max Verstappen"
          delay={0.4}
        />
      </div>

      {/* 3D Car Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border bg-card-elevated p-6">
          <h2 className="mb-4 font-orbitron text-xl font-bold text-foreground">
            3D CAR <span className="text-primary">VISUALIZATION</span>
          </h2>
          <F1CarScene />
          <p className="mt-4 text-sm text-muted-foreground">
            Interactive 3D model • Drag to rotate • Scroll to zoom
          </p>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lap Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border bg-card-elevated p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-orbitron text-xl font-bold text-foreground">
                LAP <span className="text-primary">PERFORMANCE</span>
              </h2>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="lap" 
                  stroke="#888"
                  label={{ value: 'Lap Number', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#888"
                  label={{ value: 'Time (s)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#DC0000"
                  strokeWidth={3}
                  dot={{ fill: "#DC0000", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Team Standings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border bg-card-elevated p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-orbitron text-xl font-bold text-foreground">
                TEAM <span className="text-primary">STANDINGS</span>
              </h2>
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="team" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="points" fill="#DC0000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
