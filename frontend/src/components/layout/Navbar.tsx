import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-racing racing-glow-sm" />
          <h1 className="font-orbitron text-2xl font-bold tracking-wider text-foreground">
            F1 UNIFIED <span className="text-gradient-racing">DASHBOARD</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2"
          >
            <div className="h-2 w-2 animate-glow-pulse rounded-full bg-primary" />
            <span className="text-sm font-medium text-muted-foreground">LIVE</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};
