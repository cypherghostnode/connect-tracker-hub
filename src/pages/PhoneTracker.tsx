import { useState } from "react";
import { Search, Phone, MapPin, Building } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";
import TerminalCard from "@/components/TerminalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const countryCodes: Record<string, string> = {
  "1": "United States / Canada", "7": "Russia", "20": "Egypt", "27": "South Africa",
  "30": "Greece", "31": "Netherlands", "32": "Belgium", "33": "France", "34": "Spain",
  "36": "Hungary", "39": "Italy", "40": "Romania", "41": "Switzerland", "44": "United Kingdom",
  "45": "Denmark", "46": "Sweden", "47": "Norway", "48": "Poland", "49": "Germany",
  "51": "Peru", "52": "Mexico", "53": "Cuba", "54": "Argentina", "55": "Brazil",
  "56": "Chile", "57": "Colombia", "58": "Venezuela", "60": "Malaysia", "61": "Australia",
  "62": "Indonesia", "63": "Philippines", "64": "New Zealand", "65": "Singapore",
  "66": "Thailand", "81": "Japan", "82": "South Korea", "84": "Vietnam",
  "86": "China", "90": "Turkey", "91": "India", "92": "Pakistan",
  "93": "Afghanistan", "94": "Sri Lanka", "95": "Myanmar",
  "212": "Morocco", "213": "Algeria", "216": "Tunisia", "218": "Libya",
  "234": "Nigeria", "254": "Kenya", "255": "Tanzania", "256": "Uganda",
  "966": "Saudi Arabia", "971": "UAE", "972": "Israel", "974": "Qatar",
};

const PhoneTracker = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<{ country: string; code: string; number: string; valid: boolean } | null>(null);

  const analyze = () => {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
    const digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;

    if (digits.length < 7 || digits.length > 15 || !/^\d+$/.test(digits)) {
      setResult({ country: "Unknown", code: "N/A", number: phone, valid: false });
      return;
    }

    let country = "Unknown";
    let code = "";
    for (let len = 3; len >= 1; len--) {
      const prefix = digits.substring(0, len);
      if (countryCodes[prefix]) {
        country = countryCodes[prefix];
        code = "+" + prefix;
        break;
      }
    }

    setResult({ country, code: code || "Unknown", number: cleaned, valid: true });
  };

  return (
    <TrackerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-primary">PHONE TRACKER</h1>
          <p className="text-xs text-muted-foreground">root@ghost:~/phone-tracker$</p>
        </div>

        <TerminalCard title="phone-lookup.sh">
          <div className="flex gap-2">
            <Input
              placeholder="Enter phone number (e.g. +1 555 123 4567)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
            />
            <Button onClick={analyze} className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono">
              <Search size={16} />
            </Button>
          </div>
        </TerminalCard>

        {result && (
          <TerminalCard title="results.json">
            {!result.valid ? (
              <p className="text-destructive text-sm">ERROR: Invalid phone number format</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Phone size={14} className="text-primary mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-xs">Number</span>
                    <p className="text-foreground text-sm">{result.number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building size={14} className="text-primary mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-xs">Country Code</span>
                    <p className="text-foreground text-sm">{result.code}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-primary mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-xs">Country</span>
                    <p className="text-foreground text-sm">{result.country}</p>
                  </div>
                </div>
              </div>
            )}
          </TerminalCard>
        )}
      </div>
    </TrackerLayout>
  );
};

export default PhoneTracker;
