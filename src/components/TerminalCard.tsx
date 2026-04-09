import { ReactNode } from "react";

interface TerminalCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const TerminalCard = ({ title, children, className = "" }: TerminalCardProps) => (
  <div className={`bg-card border border-border rounded-lg overflow-hidden animate-fade-in-up ${className}`}>
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/50">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/70" />
      </div>
      <span className="text-xs text-muted-foreground font-mono">{title}</span>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default TerminalCard;
