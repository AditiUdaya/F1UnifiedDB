import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Database, GitBranch, Code2 } from "lucide-react";

const About = () => {
  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          ABOUT <span className="text-gradient-racing">PROJECT</span>
        </h1>
        <p className="mt-2 text-muted-foreground">F1 Unified Dashboard - Academic DBMS Project</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card-elevated p-6">
            <Database className="mb-4 h-10 w-10 text-primary" />
            <h3 className="font-orbitron text-lg font-bold text-foreground">Database</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              MySQL f1UnifiedDB with tables for Drivers, Teams, Races, Laps, Pitstops, and Telemetry
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card-elevated p-6">
            <Code2 className="mb-4 h-10 w-10 text-accent" />
            <h3 className="font-orbitron text-lg font-bold text-foreground">Frontend</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              React + TypeScript + Tailwind CSS + Framer Motion + Three.js for immersive visualizations
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card-elevated p-6">
            <GitBranch className="mb-4 h-10 w-10 text-silver" />
            <h3 className="font-orbitron text-lg font-bold text-foreground">Features</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              CRUD operations, JOIN queries, Aggregates, Nested queries, and Real-time analytics
            </p>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-primary/20 bg-gradient-racing p-8 racing-glow-sm">
          <h2 className="font-orbitron text-2xl font-bold text-white">
            Academic Excellence in Database Management
          </h2>
          <p className="mt-4 text-white/90">
            This project demonstrates comprehensive DBMS concepts including complex SQL queries,
            database normalization, relational modeling, and data visualization techniques.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white/10 p-4">
              <h4 className="font-orbitron text-sm font-bold text-white">Key Operations</h4>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                <li>• CRUD Operations</li>
                <li>• JOIN Queries</li>
                <li>• Aggregate Functions</li>
                <li>• Nested Queries</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <h4 className="font-orbitron text-sm font-bold text-white">Technologies</h4>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                <li>• MySQL Database</li>
                <li>• React + TypeScript</li>
                <li>• Three.js 3D Graphics</li>
                <li>• Real-time Charts</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default About;
