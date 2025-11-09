import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { HealthStatus } from "@/types/query";
import { Badge } from "./ui/badge";

interface ControlsBarProps {
  database: string;
  model: string;
  apiBase: string;
  health: HealthStatus;
  onDatabaseChange: (db: string) => void;
  onModelChange: (model: string) => void;
  onApiBaseChange: (base: string) => void;
  onHealthCheck: () => void;
}

export const ControlsBar = ({
  database,
  model,
  apiBase,
  health,
  onDatabaseChange,
  onModelChange,
  onApiBaseChange,
  onHealthCheck,
}: ControlsBarProps) => {
  const getStatusBadge = (status: string) => {
    const variant = status === 'healthy' ? 'default' : 'destructive';
    return (
      <Badge variant={variant} className="ml-2">
        {status}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Database</label>
        <Select value={database} onValueChange={onDatabaseChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p43_eng_sjc01">p43_eng_sjc01</SelectItem>
            <SelectItem value="p05_eng_sjc01">p05_eng_sjc01</SelectItem>
            <SelectItem value="p07_eng_sjc01">p07_eng_sjc01</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">AI Model</label>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mistral12b">Mistral 12B</SelectItem>
            <SelectItem value="phi-4-mini-instruct">Phi-4 Mini Instruct</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">API Base URL</label>
        <input
          type="text"
          value={apiBase}
          onChange={(e) => onApiBaseChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background"
          placeholder="API Base URL"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Health Check</label>
        <Button onClick={onHealthCheck} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Status
        </Button>
        <div className="mt-2 text-xs space-y-1">
          <div>Backend: {getStatusBadge(health.backend)}</div>
          <div>ClickHouse: {getStatusBadge(health.clickhouse)}</div>
          <div>LLM: {getStatusBadge(health.llm)}</div>
        </div>
      </div>
    </div>
  );
};
