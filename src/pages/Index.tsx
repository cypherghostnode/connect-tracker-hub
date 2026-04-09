import { Link } from "react-router-dom";
import { Globe, Shield, Smartphone, User, ChevronRight } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";

const tools = [
  {
    id: 1,
    label: "IP Tracker",
    desc: "Track and geolocate any IP address worldwide",
    icon: Globe,
    path: "/ip-tracker",
  },
  {
    id: 2,
    label: "Show Your IP",
    desc: "Reveal your current public IP and location",
    icon: Shield,
    path: "/show-ip",
  },
  {
    id: 3,
    label: "Phone Number Tracker",
    desc: "Lookup carrier and region info for phone numbers",
    icon: Smartphone,
    path: "/phone-tracker",
  },
  {
    id: 4,
    label: "Username Tracker",
    desc: "Search for usernames across multiple platforms",
    icon: User,
    path: "/username-tracker",
  },
];

const Index = () => (
  <TrackerLayout>
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary tracking-wider">
          GHOST TRACKER
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Open-source intelligence toolkit.
          <span className="animate-blink text-primary ml-1">▋</span>
        </p>
        <div className="text-xs text-muted-foreground font-mono">
          root@ghost:~$ <span className="text-foreground">select module</span>
        </div>
      </div>

      {/* Menu */}
      <div className="grid gap-3">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className="group flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded border border-border bg-secondary text-primary group-hover:animate-pulse-glow">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">[ {tool.id} ]</span>
                  <span className="text-foreground font-medium text-sm">{tool.label}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-0.5">{tool.desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  </TrackerLayout>
);

export default Index;
