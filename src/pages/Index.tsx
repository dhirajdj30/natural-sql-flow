import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MetricsBar } from "@/components/MetricsBar";
import { ControlsBar } from "@/components/ControlsBar";
import { QueryInterface } from "@/components/QueryInterface";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import { QueryMetrics, QueryHistory, HealthStatus, StreamEvent } from "@/types/query";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [database, setDatabase] = useState("p43_eng_sjc01");
  const [model, setModel] = useState("mistral12b");
  const [apiBase, setApiBase] = useState("http://localhost:8004");
  const [health, setHealth] = useState<HealthStatus>({
    backend: "healthy",
    clickhouse: "healthy",
    llm: "healthy",
  });
  const [metrics, setMetrics] = useState<QueryMetrics>({
    totalQueries: 0,
    successRate: 0,
    failedQueries: 0,
    avgResponseTime: 0,
  });
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const checkHealth = async () => {
    try {
      const response = await api.checkHealth();
      setHealth({
        backend: response.status === "ok" ? "healthy" : "unhealthy",
        clickhouse: response.clickhouse === "connected" ? "healthy" : "unhealthy",
        llm: response.llm === "available" ? "healthy" : "unhealthy",
      });
      toast({
        title: "Health Check Complete",
        description: "All systems operational",
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: "Could not connect to backend",
        variant: "destructive",
      });
    }
  };

  const handleDatabaseChange = async (db: string) => {
    setDatabase(db);
    try {
      await api.setDatabase(db);
      toast({
        title: "Database Changed",
        description: `Now using ${db}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change database",
        variant: "destructive",
      });
    }
  };

  const handleRunQuery = (question: string) => {
    const startTime = Date.now();
    setIsRunning(true);
    setStreamEvents([]);

    const cleanup = api.streamQuery(question, model, apiBase, (event) => {
      setStreamEvents((prev) => [...prev, event]);

      if (event.type === "complete") {
        const executionTime = (Date.now() - startTime) / 1000;
        const newHistory: QueryHistory = {
          id: Date.now().toString(),
          question,
          timestamp: new Date().toISOString(),
          executionTime: event.execution_time || executionTime,
          status: "success",
        };
        setHistory((prev) => [newHistory, ...prev]);
        
        setMetrics((prev) => ({
          totalQueries: prev.totalQueries + 1,
          successRate: ((prev.totalQueries - prev.failedQueries + 1) / (prev.totalQueries + 1)) * 100,
          failedQueries: prev.failedQueries,
          avgResponseTime: (prev.avgResponseTime * prev.totalQueries + executionTime) / (prev.totalQueries + 1),
        }));

        setIsRunning(false);
        toast({
          title: "Query Complete",
          description: `Executed in ${executionTime.toFixed(2)}s`,
        });
      }

      if (event.type === "error") {
        const executionTime = (Date.now() - startTime) / 1000;
        const newHistory: QueryHistory = {
          id: Date.now().toString(),
          question,
          timestamp: new Date().toISOString(),
          executionTime,
          status: "error",
        };
        setHistory((prev) => [newHistory, ...prev]);
        
        setMetrics((prev) => ({
          totalQueries: prev.totalQueries + 1,
          successRate: ((prev.totalQueries - prev.failedQueries) / (prev.totalQueries + 1)) * 100,
          failedQueries: prev.failedQueries + 1,
          avgResponseTime: (prev.avgResponseTime * prev.totalQueries + executionTime) / (prev.totalQueries + 1),
        }));

        setIsRunning(false);
        toast({
          title: "Query Failed",
          description: event.error || "Unknown error",
          variant: "destructive",
        });
      }
    });

    return cleanup;
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <MetricsBar metrics={metrics} />
        
        <ControlsBar
          database={database}
          model={model}
          apiBase={apiBase}
          health={health}
          onDatabaseChange={handleDatabaseChange}
          onModelChange={setModel}
          onApiBaseChange={setApiBase}
          onHealthCheck={checkHealth}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <QueryInterface
              onRunQuery={handleRunQuery}
              isRunning={isRunning}
              streamEvents={streamEvents}
            />
          </div>
          
          <div className="lg:col-span-1">
            <Sidebar
              history={history}
              onClearHistory={() => setHistory([])}
              onSelectExample={(question) => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  textarea.value = question;
                  textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }}
            />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t mt-12">
        <p className="text-center text-sm text-muted-foreground">
          Built with FastAPI + Streamlit-style frontend
        </p>
      </footer>
    </div>
  );
};

export default Index;
