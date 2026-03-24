import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "accent" | "destructive";
}

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  destructive: "bg-destructive/10 text-destructive",
};

const StatCard = ({ title, value, icon: Icon, variant = "primary" }: StatCardProps) => (
  <div className="bg-card rounded-xl p-5 shadow-md border border-border animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", variantStyles[variant])}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default StatCard;
