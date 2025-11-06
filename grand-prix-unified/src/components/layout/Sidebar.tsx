import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Flag,
  Timer,
  Wrench,
  BarChart3,
  Code2,
  Globe,
  Info,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/drivers", icon: Users, label: "Drivers" },
  { to: "/teams", icon: Trophy, label: "Teams" },
  { to: "/races", icon: Flag, label: "Races" },
  { to: "/laps", icon: Timer, label: "Laps" },
  { to: "/pitstops", icon: Wrench, label: "Pitstops" },
  { to: "/telemetry", icon: BarChart3, label: "Telemetry" },
  { to: "/sql", icon: Code2, label: "Advanced SQL" },
  { to: "/logistics", icon: Globe, label: "Logistics" },
  { to: "/about", icon: Info, label: "About" },
];

export const Sidebar = () => {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="w-64 border-r border-border bg-sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-sidebar-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-racing racing-glow-sm">
              <Flag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-orbitron text-sm font-bold text-sidebar-foreground">F1</h2>
              <p className="text-xs text-muted-foreground">Unified DB</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground racing-glow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex w-full items-center gap-3"
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                  <span>{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-gradient-racing p-4 racing-glow-sm">
            <p className="font-orbitron text-xs font-bold text-white">DBMS PROJECT</p>
            <p className="mt-1 text-xs text-white/80">Academic Edition</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
