import { Card } from "./ui/card";
import { Code } from "lucide-react";

interface SqlOutputProps {
  sql: string;
}

export const SqlOutput = ({ sql }: SqlOutputProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Code className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Generated SQL</h3>
      </div>
      <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm">
        <code className="language-sql">{sql}</code>
      </pre>
    </Card>
  );
};
