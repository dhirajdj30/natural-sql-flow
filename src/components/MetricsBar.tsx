import { Card } from "./ui/card";
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { QueryMetrics } from "@/types/query";

interface MetricsBarProps {
  metrics: QueryMetrics;
}

export const MetricsBar = ({ metrics }: MetricsBarProps) => {
  const cards = [
    {
      label: "Total Queries",
      value: metrics.totalQueries,
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Success Rate",
      value: `${metrics.successRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-accent",
    },
    {
      label: "Failed Queries",
      value: metrics.failedQueries,
      icon: XCircle,
      color: "text-destructive",
    },
    {
      label: "Avg Response",
      value: `${metrics.avgResponseTime.toFixed(2)}s`,
      icon: Clock,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="p-4 bg-gradient-card shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <card.icon className={`h-8 w-8 ${card.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
