import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="bg-gradient-header text-white py-8 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 mb-4"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to DevOps AI Hub
        </Button>
        
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-foreground">
            NLQ → SQL
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-1">
            Ask. Don't Query!
          </p>
          <p className="text-sm text-primary-foreground/70">
            From Question to Query — Instantly.
          </p>
        </div>
      </div>
    </header>
  );
};
