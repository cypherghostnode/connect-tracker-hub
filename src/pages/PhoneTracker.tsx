import { useState } from "react";
import { Search, Phone, MapPin, Building } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";
import TerminalCard from "@/components/TerminalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlobeMap from "@/components/GlobeMap";

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

// Approximate center coordinates for each country
const countryCoords: Record<string, [number, number]> = {
  "1": [39.8, -98.5], "7": [61.5, 105.3], "20": [26.8, 30.8], "27": [-30.6, 22.9],
  "30": [39.1, 21.8], "31": [52.1, 5.3], "32": [50.5, 4.5], "33": [46.2, 2.2], "34": [40.5, -3.7],
  "36": [47.2, 19.5], "39": [41.9, 12.6], "40": [45.9, 24.97], "41": [46.8, 8.2], "44": [55.4, -3.4],
  "45": [56.3, 9.5], "46": [60.1, 18.6], "47": [60.5, 8.5], "48": [51.9, 19.1], "49": [51.2, 10.4],
  "51": [-9.2, -75.0], "52": [23.6, -102.6], "53": [21.5, -77.8], "54": [-38.4, -63.6], "55": [-14.2, -51.9],
  "56": [-35.7, -71.5], "57": [4.6, -74.1], "58": [6.4, -66.6], "60": [4.2, 101.9], "61": [-25.3, 133.8],
  "62": [-0.8, 113.9], "63": [12.9, 121.8], "64": [-40.9, 174.9], "65": [1.35, 103.8],
  "66": [15.9, 100.9], "81": [36.2, 138.3], "82": [35.9, 127.8], "84": [14.1, 108.3],
  "86": [35.9, 104.2], "90": [39.0, 35.2], "91": [20.6, 78.9], "92": [30.4, 69.3],
  "93": [33.9, 67.7], "94": [7.9, 80.8], "95": [21.9, 95.9],
  "212": [31.8, -7.1], "213": [28.0, 1.7], "216": [33.9, 9.5], "218": [26.3, 17.2],
  "234": [9.1, 8.7], "254": [-0.02, 37.9], "255": [-6.4, 34.9], "256": [1.4, 32.3],
  "966": [23.9, 45.1], "971": [23.4, 53.8], "972": [31.0, 34.9], "974": [25.4, 51.2],
};

const PhoneTracker = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<{ country: string; code: string; number: string; valid: boolean; coords: [number, number] | null } | null>(null);

  const analyze = () => {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
    const digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;

    if (digits.length < 7 || digits.length > 15 || !/^\d+$/.test(digits)) {
      setResult({ country: "Unknown", code: "N/A", number: phone, valid: false, coords: null });
      return;
    }

    let country = "Unknown";
    let code = "";
    let coords: [number, number] | null = null;
    for (let len = 3; len >= 1; len--) {
      const prefix = digits.substring(0, len);
      if (countryCodes[prefix]) {
        country = countryCodes[prefix];
        code = "+" + prefix;
        coords = countryCoords[prefix] || null;
        break;
      }
    }

    setResult({ country, code: code || "Unknown", number: cleaned, valid: true, coords });
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
          <>
            {result.valid && result.coords && (
              <TerminalCard title="geo-map.render">
                <GlobeMap
                  lat={result.coords[0]}
                  lng={result.coords[1]}
                  label={`${result.code} — ${result.country}`}
                />
              </TerminalCard>
            )}

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
          </>
        )}
      </div>
    </TrackerLayout>
  );
};

export default PhoneTracker;
