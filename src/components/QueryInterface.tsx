import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Play, Loader2 } from "lucide-react";
import { StreamEvent } from "@/types/query";
import { SqlOutput } from "./SqlOutput";
import { ResultsTable } from "./ResultsTable";

interface QueryInterfaceProps {
  onRunQuery: (question: string) => void;
  isRunning: boolean;
  streamEvents: StreamEvent[];
}

export const QueryInterface = ({ onRunQuery, isRunning, streamEvents }: QueryInterfaceProps) => {
  const [question, setQuestion] = useState("");

  const handleRun = () => {
    if (question.trim() && !isRunning) {
      onRunQuery(question);
    }
  };

  const currentSql = streamEvents.find((e) => e.type === "sql")?.sql || "";
  const currentResults = streamEvents.find((e) => e.type === "result")?.result || [];
  const statusMessages = streamEvents.filter((e) => e.type === "status").map((e) => e.message);
  const errorMessage = streamEvents.find((e) => e.type === "error")?.error;
  const completeEvent = streamEvents.find((e) => e.type === "complete");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Input */}
      <Card className="p-6 bg-gradient-card shadow-md">
        <h3 className="text-lg font-semibold mb-4">Natural Language Input</h3>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question in plain English..."
          className="min-h-[200px] mb-4 resize-none"
          disabled={isRunning}
        />
        <Button
          onClick={handleRun}
          disabled={!question.trim() || isRunning}
          className="w-full bg-gradient-primary hover:opacity-90"
          size="lg"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Run Query
            </>
          )}
        </Button>

        {isRunning && statusMessages.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Progress:</p>
            {statusMessages.map((msg, idx) => (
              <div key={idx} className="text-sm text-muted-foreground flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                {msg}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Right Panel - Output */}
      <div className="space-y-6">
        {errorMessage && (
          <Card className="p-6 bg-destructive/10 border-destructive shadow-md">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
            <p className="text-sm text-destructive">{errorMessage}</p>
          </Card>
        )}

        {currentSql && (
          <SqlOutput sql={currentSql} />
        )}

        {currentResults.length > 0 && (
          <ResultsTable data={currentResults} />
        )}

        {completeEvent && (
          <Card className="p-6 bg-accent/10 border-accent shadow-md">
            <h3 className="text-lg font-semibold text-accent mb-2">✓ Query Complete</h3>
            <p className="text-sm">
              Execution time: <span className="font-mono">{completeEvent.execution_time?.toFixed(3)}s</span>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
