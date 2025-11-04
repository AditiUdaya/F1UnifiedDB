import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const Races = () => {
  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          RACES <span className="text-gradient-racing">SCHEDULE</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Coming soon...</p>
      </motion.div>
    </div>
  );
};

export default Races;
