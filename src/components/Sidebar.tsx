import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Clock } from "lucide-react";
import { QueryHistory } from "@/types/query";
import { Badge } from "./ui/badge";

interface SidebarProps {
  history: QueryHistory[];
  onClearHistory: () => void;
  onSelectExample: (question: string) => void;
}

const EXAMPLE_QUERIES = {
  "Basic Queries": [
    "Show me all users created in the last 7 days",
    "What are the top 10 products by revenue?",
  ],
  "Analytics": [
    "Calculate monthly revenue trends for 2024",
    "Show average order value by customer segment",
  ],
  "Operations": [
    "List all failed transactions in the last hour",
    "Show system performance metrics for today",
  ],
};

export const Sidebar = ({ history, onClearHistory, onSelectExample }: SidebarProps) => {
  return (
    <aside className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-md">
        <h3 className="text-lg font-semibold mb-4">Example Queries</h3>
        <div className="space-y-4">
          {Object.entries(EXAMPLE_QUERIES).map(([category, queries]) => (
            <div key={category}>
              <p className="text-sm font-medium text-muted-foreground mb-2">{category}</p>
              <div className="space-y-2">
                {queries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectExample(query)}
                    className="w-full text-left text-sm p-3 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Queries</h3>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent queries</p>
          ) : (
            history.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3 rounded-md bg-secondary text-sm">
                <p className="line-clamp-2 mb-2">{item.question}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.executionTime.toFixed(2)}s
                  </span>
                  <Badge variant={item.status === "success" ? "default" : "destructive"}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </aside>
  );
};
