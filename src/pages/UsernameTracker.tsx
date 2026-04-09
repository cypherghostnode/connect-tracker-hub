import { useState } from "react";
import { Search, ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";
import TerminalCard from "@/components/TerminalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const platforms = [
  { name: "GitHub", url: (u: string) => `https://github.com/${u}`, check: (u: string) => `https://api.github.com/users/${u}` },
  { name: "Twitter/X", url: (u: string) => `https://x.com/${u}` },
  { name: "Instagram", url: (u: string) => `https://instagram.com/${u}` },
  { name: "Reddit", url: (u: string) => `https://reddit.com/user/${u}` },
  { name: "TikTok", url: (u: string) => `https://tiktok.com/@${u}` },
  { name: "YouTube", url: (u: string) => `https://youtube.com/@${u}` },
  { name: "Twitch", url: (u: string) => `https://twitch.tv/${u}` },
  { name: "LinkedIn", url: (u: string) => `https://linkedin.com/in/${u}` },
  { name: "Pinterest", url: (u: string) => `https://pinterest.com/${u}` },
  { name: "Telegram", url: (u: string) => `https://t.me/${u}` },
];

interface PlatformResult {
  name: string;
  url: string;
  status: "checking" | "found" | "not_found" | "unknown";
}

const UsernameTracker = () => {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<PlatformResult[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    if (!username.trim()) return;
    setSearching(true);
    const u = username.trim();

    const initial: PlatformResult[] = platforms.map((p) => ({
      name: p.name,
      url: p.url(u),
      status: "checking",
    }));
    setResults(initial);

    // Check GitHub (has public API)
    const updated = [...initial];
    try {
      const res = await fetch(`https://api.github.com/users/${u}`);
      updated[0].status = res.ok ? "found" : "not_found";
    } catch {
      updated[0].status = "unknown";
    }

    // For other platforms, we generate links (can't reliably check without CORS issues)
    for (let i = 1; i < updated.length; i++) {
      updated[i].status = "unknown";
    }

    setResults([...updated]);
    setSearching(false);
  };

  const statusIcon = (s: PlatformResult["status"]) => {
    switch (s) {
      case "checking": return <Loader2 size={14} className="animate-spin text-muted-foreground" />;
      case "found": return <CheckCircle size={14} className="text-primary" />;
      case "not_found": return <XCircle size={14} className="text-destructive" />;
      default: return <ExternalLink size={14} className="text-muted-foreground" />;
    }
  };

  const statusLabel = (s: PlatformResult["status"]) => {
    switch (s) {
      case "checking": return "Checking...";
      case "found": return "Found";
      case "not_found": return "Not Found";
      default: return "Check Link";
    }
  };

  return (
    <TrackerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-primary">USERNAME TRACKER</h1>
          <p className="text-xs text-muted-foreground">root@ghost:~/username-tracker$</p>
        </div>

        <TerminalCard title="username-scan.sh">
          <div className="flex gap-2">
            <Input
              placeholder="Enter username to search"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
            />
            <Button onClick={search} disabled={searching} className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono">
              {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </Button>
          </div>
        </TerminalCard>

        {results.length > 0 && (
          <TerminalCard title={`scan-results — @${username}`}>
            <div className="space-y-2">
              {results.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded border border-border bg-secondary/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon(r.status)}
                    <span className="text-foreground">{r.name}</span>
                  </div>
                  <span className={`text-xs ${r.status === "found" ? "text-primary" : "text-muted-foreground"}`}>
                    {statusLabel(r.status)}
                  </span>
                </a>
              ))}
            </div>
          </TerminalCard>
        )}
      </div>
    </TrackerLayout>
  );
};

export default UsernameTracker;
