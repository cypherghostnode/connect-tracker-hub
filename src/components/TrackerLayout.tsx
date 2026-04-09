import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Globe, Smartphone, User, Home } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/ip-tracker", label: "IP Tracker", icon: Globe },
  { path: "/show-ip", label: "Show Your IP", icon: Shield },
  { path: "/phone-tracker", label: "Phone Tracker", icon: Smartphone },
  { path: "/username-tracker", label: "Username Tracker", icon: User },
];

const TrackerLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(120_100%_50%/0.03)_2px,hsl(120_100%_50%/0.03)_4px)]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-1 overflow-x-auto">
          <span className="text-primary font-display text-sm font-bold mr-4 whitespace-nowrap">
            GHOST<span className="text-muted-foreground">TRACKER</span>
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default TrackerLayout;
