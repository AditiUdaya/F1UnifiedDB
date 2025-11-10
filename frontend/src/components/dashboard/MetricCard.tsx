import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
}

export const MetricCard = ({ title, value, icon: Icon, trend, delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <Card className="relative overflow-hidden border-border bg-card-elevated p-6 transition-all hover:racing-glow-sm">
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-racing" />
        
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-2 font-orbitron text-3xl font-bold text-foreground">{value}</h3>
            {trend && (
              <p className="mt-2 text-xs text-accent">{trend}</p>
            )}
          </div>
          
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
