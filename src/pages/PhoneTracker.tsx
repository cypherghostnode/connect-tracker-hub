import { useState } from "react";
import { Search, Phone, MapPin, Building, Shield, Globe, Clock, Wifi, AlertTriangle, CheckCircle, Info } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";
import TerminalCard from "@/components/TerminalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlobeMap from "@/components/GlobeMap";

const countryCodes: Record<string, { name: string; flag: string; timezone: string; region: string }> = {
  "1":   { name: "United States / Canada", flag: "🇺🇸", timezone: "UTC-5 to UTC-10", region: "North America" },
  "7":   { name: "Russia", flag: "🇷🇺", timezone: "UTC+2 to UTC+12", region: "Eastern Europe / Asia" },
  "20":  { name: "Egypt", flag: "🇪🇬", timezone: "UTC+2", region: "North Africa" },
  "27":  { name: "South Africa", flag: "🇿🇦", timezone: "UTC+2", region: "Southern Africa" },
  "30":  { name: "Greece", flag: "🇬🇷", timezone: "UTC+2", region: "Southern Europe" },
  "31":  { name: "Netherlands", flag: "🇳🇱", timezone: "UTC+1", region: "Western Europe" },
  "32":  { name: "Belgium", flag: "🇧🇪", timezone: "UTC+1", region: "Western Europe" },
  "33":  { name: "France", flag: "🇫🇷", timezone: "UTC+1", region: "Western Europe" },
  "34":  { name: "Spain", flag: "🇪🇸", timezone: "UTC+1", region: "Southern Europe" },
  "36":  { name: "Hungary", flag: "🇭🇺", timezone: "UTC+1", region: "Central Europe" },
  "39":  { name: "Italy", flag: "🇮🇹", timezone: "UTC+1", region: "Southern Europe" },
  "40":  { name: "Romania", flag: "🇷🇴", timezone: "UTC+2", region: "Eastern Europe" },
  "41":  { name: "Switzerland", flag: "🇨🇭", timezone: "UTC+1", region: "Western Europe" },
  "44":  { name: "United Kingdom", flag: "🇬🇧", timezone: "UTC+0", region: "Western Europe" },
  "45":  { name: "Denmark", flag: "🇩🇰", timezone: "UTC+1", region: "Northern Europe" },
  "46":  { name: "Sweden", flag: "🇸🇪", timezone: "UTC+1", region: "Northern Europe" },
  "47":  { name: "Norway", flag: "🇳🇴", timezone: "UTC+1", region: "Northern Europe" },
  "48":  { name: "Poland", flag: "🇵🇱", timezone: "UTC+1", region: "Central Europe" },
  "49":  { name: "Germany", flag: "🇩🇪", timezone: "UTC+1", region: "Western Europe" },
  "51":  { name: "Peru", flag: "🇵🇪", timezone: "UTC-5", region: "South America" },
  "52":  { name: "Mexico", flag: "🇲🇽", timezone: "UTC-6 to UTC-8", region: "North America" },
  "53":  { name: "Cuba", flag: "🇨🇺", timezone: "UTC-5", region: "Caribbean" },
  "54":  { name: "Argentina", flag: "🇦🇷", timezone: "UTC-3", region: "South America" },
  "55":  { name: "Brazil", flag: "🇧🇷", timezone: "UTC-3 to UTC-5", region: "South America" },
  "56":  { name: "Chile", flag: "🇨🇱", timezone: "UTC-4", region: "South America" },
  "57":  { name: "Colombia", flag: "🇨🇴", timezone: "UTC-5", region: "South America" },
  "58":  { name: "Venezuela", flag: "🇻🇪", timezone: "UTC-4", region: "South America" },
  "60":  { name: "Malaysia", flag: "🇲🇾", timezone: "UTC+8", region: "Southeast Asia" },
  "61":  { name: "Australia", flag: "🇦🇺", timezone: "UTC+8 to UTC+11", region: "Oceania" },
  "62":  { name: "Indonesia", flag: "🇮🇩", timezone: "UTC+7 to UTC+9", region: "Southeast Asia" },
  "63":  { name: "Philippines", flag: "🇵🇭", timezone: "UTC+8", region: "Southeast Asia" },
  "64":  { name: "New Zealand", flag: "🇳🇿", timezone: "UTC+12", region: "Oceania" },
  "65":  { name: "Singapore", flag: "🇸🇬", timezone: "UTC+8", region: "Southeast Asia" },
  "66":  { name: "Thailand", flag: "🇹🇭", timezone: "UTC+7", region: "Southeast Asia" },
  "81":  { name: "Japan", flag: "🇯🇵", timezone: "UTC+9", region: "East Asia" },
  "82":  { name: "South Korea", flag: "🇰🇷", timezone: "UTC+9", region: "East Asia" },
  "84":  { name: "Vietnam", flag: "🇻🇳", timezone: "UTC+7", region: "Southeast Asia" },
  "86":  { name: "China", flag: "🇨🇳", timezone: "UTC+8", region: "East Asia" },
  "90":  { name: "Turkey", flag: "🇹🇷", timezone: "UTC+3", region: "Western Asia" },
  "91":  { name: "India", flag: "🇮🇳", timezone: "UTC+5:30", region: "South Asia" },
  "92":  { name: "Pakistan", flag: "🇵🇰", timezone: "UTC+5", region: "South Asia" },
  "93":  { name: "Afghanistan", flag: "🇦🇫", timezone: "UTC+4:30", region: "South Asia" },
  "94":  { name: "Sri Lanka", flag: "🇱🇰", timezone: "UTC+5:30", region: "South Asia" },
  "95":  { name: "Myanmar", flag: "🇲🇲", timezone: "UTC+6:30", region: "Southeast Asia" },
  "212": { name: "Morocco", flag: "🇲🇦", timezone: "UTC+1", region: "North Africa" },
  "213": { name: "Algeria", flag: "🇩🇿", timezone: "UTC+1", region: "North Africa" },
  "216": { name: "Tunisia", flag: "🇹🇳", timezone: "UTC+1", region: "North Africa" },
  "218": { name: "Libya", flag: "🇱🇾", timezone: "UTC+2", region: "North Africa" },
  "234": { name: "Nigeria", flag: "🇳🇬", timezone: "UTC+1", region: "West Africa" },
  "254": { name: "Kenya", flag: "🇰🇪", timezone: "UTC+3", region: "East Africa" },
  "255": { name: "Tanzania", flag: "🇹🇿", timezone: "UTC+3", region: "East Africa" },
  "256": { name: "Uganda", flag: "🇺🇬", timezone: "UTC+3", region: "East Africa" },
  "966": { name: "Saudi Arabia", flag: "🇸🇦", timezone: "UTC+3", region: "Middle East" },
  "971": { name: "UAE", flag: "🇦🇪", timezone: "UTC+4", region: "Middle East" },
  "972": { name: "Israel", flag: "🇮🇱", timezone: "UTC+2", region: "Middle East" },
  "974": { name: "Qatar", flag: "🇶🇦", timezone: "UTC+3", region: "Middle East" },
};

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

// Simulated carrier databases by country code prefix
const carrierDb: Record<string, string[]> = {
  "1": ["AT&T", "Verizon", "T-Mobile", "Sprint"],
  "44": ["Vodafone UK", "EE", "Three UK", "O2"],
  "91": ["Jio", "Airtel", "Vi (Vodafone Idea)", "BSNL"],
  "49": ["Deutsche Telekom", "Vodafone DE", "O2 Germany"],
  "33": ["Orange", "SFR", "Bouygues Telecom", "Free Mobile"],
  "81": ["NTT Docomo", "SoftBank", "au (KDDI)"],
  "86": ["China Mobile", "China Unicom", "China Telecom"],
  "55": ["Vivo", "Claro", "TIM", "Oi"],
  "61": ["Telstra", "Optus", "Vodafone AU"],
  "82": ["SK Telecom", "KT", "LG U+"],
};

type LineType = "Mobile" | "Landline" | "VoIP" | "Toll-Free" | "Premium";
type RiskLevel = "low" | "medium" | "high";

interface PhoneResult {
  valid: boolean;
  normalized: string;
  countryCode: string;
  countryInfo: { name: string; flag: string; timezone: string; region: string } | null;
  coords: [number, number] | null;
  carrier: string;
  lineType: LineType;
  riskLevel: RiskLevel;
  riskScore: number;
  riskFactors: string[];
  intelligence: string;
  localNumber: string;
}

function detectLineType(digits: string, code: string): LineType {
  const local = digits.slice(code.length);
  if (digits.startsWith("1800") || digits.startsWith("1888") || digits.startsWith("1877")) return "Toll-Free";
  if (digits.startsWith("1900") || digits.startsWith("1976")) return "Premium";
  // VoIP ranges (simulated)
  if (local.startsWith("0") || local.startsWith("100")) return "VoIP";
  // Landline heuristic: shorter local numbers or specific patterns
  if (local.length <= 7) return "Landline";
  return "Mobile";
}

function calculateRisk(lineType: LineType, digits: string, code: string): { level: RiskLevel; score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  if (lineType === "VoIP") {
    score += 35;
    factors.push("VoIP number — commonly used for spoofing");
  }
  if (lineType === "Premium") {
    score += 25;
    factors.push("Premium rate number — potential scam vector");
  }
  if (lineType === "Toll-Free") {
    score += 15;
    factors.push("Toll-free number — often used by businesses and robocallers");
  }

  // High-risk country codes (simulated)
  const highRiskCodes = ["93", "234", "218", "53"];
  if (highRiskCodes.includes(code)) {
    score += 25;
    factors.push("Originates from high-fraud-risk region");
  }

  // Number pattern analysis
  const local = digits.slice(code.length);
  const uniqueDigits = new Set(local).size;
  if (uniqueDigits <= 3) {
    score += 15;
    factors.push("Suspicious repeating digit pattern");
  }
  if (local.startsWith("000") || local.startsWith("111") || local.startsWith("999")) {
    score += 10;
    factors.push("Sequential/repeating prefix detected");
  }

  if (factors.length === 0) {
    factors.push("No significant risk indicators detected");
  }

  const level: RiskLevel = score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  return { level, score: Math.min(score, 100), factors };
}

function generateIntelligence(result: Omit<PhoneResult, "intelligence">): string {
  const parts: string[] = [];
  parts.push(`This number is registered under the ${result.countryInfo?.name || "Unknown"} country code (+${result.countryCode}).`);
  parts.push(`It is classified as a ${result.lineType} line, likely operated by ${result.carrier}.`);
  if (result.countryInfo) {
    parts.push(`The number falls within the ${result.countryInfo.region} region (${result.countryInfo.timezone}).`);
  }
  if (result.riskLevel === "high") {
    parts.push("⚠ This number exhibits multiple high-risk indicators and should be treated with caution.");
  } else if (result.riskLevel === "medium") {
    parts.push("This number has some risk indicators that warrant further investigation.");
  } else {
    parts.push("No significant risk indicators were identified for this number.");
  }
  return parts.join(" ");
}

const PhoneTracker = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PhoneResult | null>(null);

  const analyze = () => {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
    const digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;

    if (digits.length < 7 || digits.length > 15 || !/^\d+$/.test(digits)) {
      setResult({
        valid: false, normalized: phone, countryCode: "", countryInfo: null,
        coords: null, carrier: "Unknown", lineType: "Mobile", riskLevel: "low",
        riskScore: 0, riskFactors: [], intelligence: "", localNumber: "",
      });
      return;
    }

    let code = "";
    let countryInfo: PhoneResult["countryInfo"] = null;
    let coords: [number, number] | null = null;

    for (let len = 3; len >= 1; len--) {
      const prefix = digits.substring(0, len);
      if (countryCodes[prefix]) {
        code = prefix;
        countryInfo = countryCodes[prefix];
        coords = countryCoords[prefix] || null;
        break;
      }
    }

    const lineType = detectLineType(digits, code);
    const carriers = carrierDb[code] || ["Unknown Carrier"];
    const carrier = carriers[Math.abs(hashCode(digits)) % carriers.length];
    const risk = calculateRisk(lineType, digits, code);
    const localNumber = code ? digits.slice(code.length) : digits;
    const normalized = code ? `+${code} ${formatLocal(localNumber)}` : `+${digits}`;

    const partial: Omit<PhoneResult, "intelligence"> = {
      valid: true, normalized, countryCode: code, countryInfo, coords,
      carrier, lineType, riskLevel: risk.level, riskScore: risk.score,
      riskFactors: risk.factors, localNumber,
    };

    setResult({ ...partial, intelligence: generateIntelligence(partial) });
  };

  return (
    <TrackerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-primary">PHONE TRACKER</h1>
          <p className="text-xs text-muted-foreground font-mono">root@ghost:~/phone-tracker$ — Advanced OSINT Analysis</p>
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

        {result && !result.valid && (
          <TerminalCard title="error.log">
            <p className="text-destructive text-sm font-mono">ERROR: Invalid phone number format. Please enter a valid international number.</p>
          </TerminalCard>
        )}

        {result && result.valid && (
          <>
            {/* Normalized Number */}
            <TerminalCard title="normalize.sh">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Normalized Format</p>
                    <p className="text-foreground font-mono text-lg font-bold">{result.normalized}</p>
                  </div>
                </div>
                {result.countryInfo && (
                  <span className="text-3xl">{result.countryInfo.flag}</span>
                )}
              </div>
            </TerminalCard>

            {/* Map */}
            {result.coords && (
              <TerminalCard title="geo-map.render">
                <GlobeMap
                  lat={result.coords[0]}
                  lng={result.coords[1]}
                  label={`+${result.countryCode} — ${result.countryInfo?.name || "Unknown"}`}
                />
              </TerminalCard>
            )}

            {/* Country & Region Info */}
            <TerminalCard title="geo-intel.json">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={<Globe size={14} />} label="Country" value={result.countryInfo?.name || "Unknown"} />
                <InfoRow icon={<MapPin size={14} />} label="Region" value={result.countryInfo?.region || "Unknown"} />
                <InfoRow icon={<Clock size={14} />} label="Timezone" value={result.countryInfo?.timezone || "Unknown"} />
                <InfoRow icon={<Building size={14} />} label="Country Code" value={`+${result.countryCode}`} />
              </div>
            </TerminalCard>

            {/* Carrier & Line Type */}
            <TerminalCard title="carrier-detect.sh">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={<Wifi size={14} />} label="Carrier" value={result.carrier} />
                <div className="flex items-start gap-2">
                  <Phone size={14} className="text-primary mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-xs">Line Type</span>
                    <div className="mt-0.5">
                      <Badge variant={result.lineType === "VoIP" ? "destructive" : "secondary"} className="font-mono text-xs">
                        {result.lineType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TerminalCard>

            {/* Risk Assessment */}
            <TerminalCard title="risk-assessment.sh">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={
                      result.riskLevel === "high" ? "text-destructive" :
                      result.riskLevel === "medium" ? "text-yellow-500" :
                      "text-primary"
                    } />
                    <span className="text-foreground font-mono text-sm font-bold">Risk Score: {result.riskScore}/100</span>
                  </div>
                  <Badge
                    variant={result.riskLevel === "high" ? "destructive" : result.riskLevel === "medium" ? "outline" : "secondary"}
                    className="font-mono uppercase text-xs"
                  >
                    {result.riskLevel === "high" && <AlertTriangle size={10} className="mr-1" />}
                    {result.riskLevel === "low" && <CheckCircle size={10} className="mr-1" />}
                    {result.riskLevel} risk
                  </Badge>
                </div>

                {/* Risk bar */}
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.riskLevel === "high" ? "bg-destructive" :
                      result.riskLevel === "medium" ? "bg-yellow-500" :
                      "bg-primary"
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  />
                </div>

                <div className="space-y-1.5">
                  {result.riskFactors.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-muted-foreground font-mono mt-px">›</span>
                      <span className="text-muted-foreground font-mono">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TerminalCard>

            {/* Intelligence Summary */}
            <TerminalCard title="intelligence-summary.md">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground text-sm font-mono leading-relaxed">{result.intelligence}</p>
              </div>
            </TerminalCard>
          </>
        )}
      </div>
    </TrackerLayout>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-primary mt-0.5">{icon}</span>
    <div>
      <span className="text-muted-foreground text-xs">{label}</span>
      <p className="text-foreground text-sm font-mono">{value}</p>
    </div>
  </div>
);

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

function formatLocal(num: string): string {
  if (num.length <= 4) return num;
  if (num.length <= 7) return `${num.slice(0, 3)} ${num.slice(3)}`;
  return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
}

export default PhoneTracker;
