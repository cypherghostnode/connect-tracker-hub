import { useState, useEffect } from "react";
import { Shield, Globe, MapPin, Server, RefreshCw } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";
import TerminalCard from "@/components/TerminalCard";
import { Button } from "@/components/ui/button";
import GlobeMap from "@/components/GlobeMap";


const ShowIp = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchIp = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ipinfo.io/json");
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIp(); }, []);

  const getCoords = (): [number, number] | null => {
    if (!data?.loc) return null;
    const [lat, lng] = data.loc.split(",").map(Number);
    return [lat, lng];
  };

  const coords = getCoords();

  return (
    <TrackerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-bold text-primary">YOUR IP</h1>
            <p className="text-xs text-muted-foreground">root@ghost:~/show-ip$</p>
          </div>
          <Button onClick={fetchIp} variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground font-mono text-xs">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <TerminalCard title="fetching...">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="animate-spin"><RefreshCw size={14} /></div>
              Scanning network...
            </div>
          </TerminalCard>
        ) : data ? (
          <>
            <TerminalCard title="your-identity.sh">
              <div className="text-center py-4">
                <Shield size={32} className="text-primary mx-auto mb-3 animate-pulse-glow" />
                <p className="text-3xl font-display font-bold text-primary tracking-wider">{data.ip}</p>
                <p className="text-muted-foreground text-xs mt-1">Your public IP address</p>
              </div>
            </TerminalCard>

            {coords && (
              <TerminalCard title="earth-view.render">
                <GlobeMap lat={coords[0]} lng={coords[1]} label={`${data.ip} — ${data.city}, ${data.country}`} />
              </TerminalCard>
            )}

            <TerminalCard title="details.json">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { icon: MapPin, label: "City", value: data.city },
                  { icon: MapPin, label: "Region", value: data.region },
                  { icon: Globe, label: "Country", value: data.country },
                  { icon: Server, label: "ISP", value: data.org },
                  { icon: MapPin, label: "Coordinates", value: data.loc },
                  { icon: Globe, label: "Timezone", value: data.timezone },
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
          </>
        ) : (
          <TerminalCard title="error">
            <p className="text-destructive text-sm">Failed to retrieve IP information.</p>
          </TerminalCard>
        )}
      </div>
    </TrackerLayout>
  );
};

export default ShowIp;
