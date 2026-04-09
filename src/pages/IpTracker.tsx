import { useState } from "react";
import { Search, MapPin, Globe, Server } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";
import TerminalCard from "@/components/TerminalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IpData {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
  postal: string;
}

const IpTracker = () => {
  const [ip, setIp] = useState("");
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const track = async () => {
    if (!ip.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`https://ipinfo.io/${ip.trim()}/json`);
      if (!res.ok) throw new Error("Invalid IP address");
      const json = await res.json();
      if (json.bogon) throw new Error("Bogon/private IP address");
      setData(json);
    } catch (e: any) {
      setError(e.message || "Failed to track IP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrackerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-primary">IP TRACKER</h1>
          <p className="text-xs text-muted-foreground">root@ghost:~/ip-tracker$</p>
        </div>

        <TerminalCard title="ip-lookup.sh">
          <div className="flex gap-2">
            <Input
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && track()}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
            />
            <Button onClick={track} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono">
              {loading ? "..." : <Search size={16} />}
            </Button>
          </div>
          {error && <p className="text-destructive text-xs mt-3">ERROR: {error}</p>}
        </TerminalCard>

        {data && (
          <TerminalCard title="results.json">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { icon: Globe, label: "IP", value: data.ip },
                { icon: MapPin, label: "Location", value: `${data.city}, ${data.region}, ${data.country}` },
                { icon: Server, label: "ISP", value: data.org },
                { icon: MapPin, label: "Coordinates", value: data.loc },
                { icon: Globe, label: "Timezone", value: data.timezone },
                { icon: MapPin, label: "Postal", value: data.postal },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-2">
                    <Icon size={14} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-muted-foreground text-xs">{item.label}</span>
                      <p className="text-foreground text-xs">{item.value || "N/A"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TerminalCard>
        )}
      </div>
    </TrackerLayout>
  );
};

export default IpTracker;
