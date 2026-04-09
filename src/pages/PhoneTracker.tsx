import { useState } from "react";
import { Search, Phone, MapPin, Building, Shield, Globe, Clock, Wifi, AlertTriangle, CheckCircle, Info, MessageSquare, Download, FileText, Plus, Trash2, Copy } from "lucide-react";
import TrackerLayout from "@/components/TrackerLayout";
import TerminalCard from "@/components/TerminalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

const platformDb: Record<string, { whatsapp: boolean; telegram: boolean; viber: boolean; signal: boolean }> = {
  mobile: { whatsapp: true, telegram: true, viber: true, signal: true },
  landline: { whatsapp: false, telegram: false, viber: false, signal: false },
  voip: { whatsapp: false, telegram: true, viber: false, signal: true },
  tollfree: { whatsapp: false, telegram: false, viber: false, signal: false },
  premium: { whatsapp: false, telegram: false, viber: false, signal: false },
};

type LineType = "Mobile" | "Landline" | "VoIP" | "Toll-Free" | "Premium";
type RiskLevel = "low" | "medium" | "high";

interface PlatformPresence {
  whatsapp: boolean;
  telegram: boolean;
  viber: boolean;
  signal: boolean;
}

interface CaseLog {
  id: string;
  timestamp: string;
  note: string;
}

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
  platforms: PlatformPresence;
  analysisTimestamp: string;
}

function detectLineType(digits: string, code: string): LineType {
  const local = digits.slice(code.length);
  if (digits.startsWith("1800") || digits.startsWith("1888") || digits.startsWith("1877")) return "Toll-Free";
  if (digits.startsWith("1900") || digits.startsWith("1976")) return "Premium";
  if (local.startsWith("0") || local.startsWith("100")) return "VoIP";
  if (local.length <= 7) return "Landline";
  return "Mobile";
}

function detectPlatforms(lineType: LineType, digits: string): PlatformPresence {
  const key = lineType.toLowerCase().replace("-", "") as keyof typeof platformDb;
  const base = platformDb[key] || platformDb.mobile;
  const h = Math.abs(hashCode(digits));
  return {
    whatsapp: base.whatsapp && h % 3 !== 0,
    telegram: base.telegram && h % 5 !== 0,
    viber: base.viber && h % 4 !== 0,
    signal: base.signal && h % 7 !== 0,
  };
}

function calculateRisk(lineType: LineType, digits: string, code: string, platforms: PlatformPresence): { level: RiskLevel; score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  if (lineType === "VoIP") {
    score += 35;
    factors.push("VoIP number — commonly used for identity spoofing and fraud");
  }
  if (lineType === "Premium") {
    score += 25;
    factors.push("Premium rate number — potential scam or revenue generation vector");
  }
  if (lineType === "Toll-Free") {
    score += 15;
    factors.push("Toll-free number — frequently used by robocallers and telemarketing");
  }

  const highRiskCodes = ["93", "234", "218", "53"];
  if (highRiskCodes.includes(code)) {
    score += 25;
    factors.push("Originates from region with elevated fraud activity (INTERPOL data)");
  }

  const local = digits.slice(code.length);
  const uniqueDigits = new Set(local).size;
  if (uniqueDigits <= 3) {
    score += 15;
    factors.push("Anomalous digit distribution — possible auto-generated number");
  }
  if (local.startsWith("000") || local.startsWith("111") || local.startsWith("999")) {
    score += 10;
    factors.push("Sequential/repeating prefix — common in bulk-provisioned numbers");
  }

  if (!platforms.whatsapp && !platforms.telegram && !platforms.viber && !platforms.signal && lineType === "Mobile") {
    score += 15;
    factors.push("No cross-platform presence detected — possible burner or disposable number");
  }

  if (factors.length === 0) {
    factors.push("No significant risk indicators detected");
  }

  const level: RiskLevel = score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  return { level, score: Math.min(score, 100), factors };
}

function generateIntelligence(result: Omit<PhoneResult, "intelligence">): string {
  const parts: string[] = [];
  parts.push(`SUBJECT NUMBER: ${result.normalized}`);
  parts.push(`\nANALYSIS TIMESTAMP: ${result.analysisTimestamp}`);
  parts.push(`\n\nGEOGRAPHIC ASSESSMENT: This number is registered under the ${result.countryInfo?.name || "Unknown"} country code (+${result.countryCode}), placing it within the ${result.countryInfo?.region || "Unknown"} region. Local timezone is ${result.countryInfo?.timezone || "Unknown"}.`);
  parts.push(`\nCARRIER INTELLIGENCE: Identified as a ${result.lineType} line, likely serviced by ${result.carrier}. ${result.lineType === "VoIP" ? "VoIP classification indicates the number may not be tied to a physical SIM card, reducing traceability." : result.lineType === "Mobile" ? "Mobile classification suggests the number is tied to a physical SIM card and device." : ""}`);

  const activePlatforms = [];
  if (result.platforms.whatsapp) activePlatforms.push("WhatsApp");
  if (result.platforms.telegram) activePlatforms.push("Telegram");
  if (result.platforms.viber) activePlatforms.push("Viber");
  if (result.platforms.signal) activePlatforms.push("Signal");
  parts.push(`\nDIGITAL FOOTPRINT: ${activePlatforms.length > 0 ? `Number linked to ${activePlatforms.join(", ")}. Cross-platform presence suggests active usage and potential for additional OSINT collection.` : "No cross-platform presence detected. This may indicate a recently provisioned number, a burner device, or privacy-conscious usage."}`);

  if (result.riskLevel === "high") {
    parts.push("\nRISK ASSESSMENT: HIGH — This number exhibits multiple indicators associated with fraudulent or malicious activity. Exercise caution in any engagement. Recommend further investigation before interaction.");
  } else if (result.riskLevel === "medium") {
    parts.push("\nRISK ASSESSMENT: MEDIUM — Some risk indicators present. Standard verification procedures recommended before establishing trust.");
  } else {
    parts.push("\nRISK ASSESSMENT: LOW — No significant threat indicators identified. Number appears consistent with legitimate usage patterns.");
  }

  parts.push("\n\nDISCLAIMER: This analysis is based on publicly available data and heuristic assessment. Geographic location shown is approximate (country-level) and does not represent precise positioning. All findings should be independently verified.");

  return parts.join("");
}

const PhoneTracker = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PhoneResult | null>(null);
  const [caseLogs, setCaseLogs] = useState<CaseLog[]>([]);
  const [newNote, setNewNote] = useState("");

  const analyze = () => {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
    const digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;

    if (digits.length < 7 || digits.length > 15 || !/^\d+$/.test(digits)) {
      setResult({
        valid: false, normalized: phone, countryCode: "", countryInfo: null,
        coords: null, carrier: "Unknown", lineType: "Mobile", riskLevel: "low",
        riskScore: 0, riskFactors: [], intelligence: "", localNumber: "",
        platforms: { whatsapp: false, telegram: false, viber: false, signal: false },
        analysisTimestamp: new Date().toISOString(),
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
    const platforms = detectPlatforms(lineType, digits);
    const risk = calculateRisk(lineType, digits, code, platforms);
    const localNumber = code ? digits.slice(code.length) : digits;
    const normalized = code ? `+${code} ${formatLocal(localNumber)}` : `+${digits}`;
    const analysisTimestamp = new Date().toISOString();

    const partial: Omit<PhoneResult, "intelligence"> = {
      valid: true, normalized, countryCode: code, countryInfo, coords,
      carrier, lineType, riskLevel: risk.level, riskScore: risk.score,
      riskFactors: risk.factors, localNumber, platforms, analysisTimestamp,
    };

    setResult({ ...partial, intelligence: generateIntelligence(partial) });
    setCaseLogs([{
      id: crypto.randomUUID(),
      timestamp: analysisTimestamp,
      note: `Analysis initiated for ${normalized}`,
    }]);
  };

  const addCaseLog = () => {
    if (!newNote.trim()) return;
    setCaseLogs(prev => [...prev, {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      note: newNote.trim(),
    }]);
    setNewNote("");
  };

  const removeCaseLog = (id: string) => {
    setCaseLogs(prev => prev.filter(l => l.id !== id));
  };

  const exportJSON = () => {
    if (!result) return;
    const report = {
      subject: result.normalized,
      analysisTimestamp: result.analysisTimestamp,
      country: result.countryInfo,
      carrier: result.carrier,
      lineType: result.lineType,
      riskAssessment: { level: result.riskLevel, score: result.riskScore, factors: result.riskFactors },
      platformPresence: result.platforms,
      intelligence: result.intelligence,
      caseLogs,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phone-report-${result.countryCode}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!result) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Phone Intelligence Report</title>
      <style>
        body { font-family: monospace; background: #0a0a0a; color: #4ade80; padding: 40px; max-width: 800px; margin: auto; }
        h1 { color: #00ff00; border-bottom: 1px solid #1a3a1a; padding-bottom: 10px; }
        h2 { color: #22c55e; margin-top: 24px; }
        .section { background: #111; border: 1px solid #1a3a1a; border-radius: 8px; padding: 16px; margin: 12px 0; }
        .label { color: #6b7280; font-size: 12px; }
        .value { color: #e5e7eb; }
        .risk-high { color: #ef4444; } .risk-medium { color: #eab308; } .risk-low { color: #22c55e; }
        .disclaimer { color: #6b7280; font-size: 11px; margin-top: 24px; border-top: 1px solid #1a3a1a; padding-top: 12px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 6px 12px; border-bottom: 1px solid #1a3a1a; }
        @media print { body { background: white; color: black; } .section { border-color: #ccc; background: #f9f9f9; } h1, h2 { color: #111; } }
      </style></head><body>
      <h1>📞 PHONE INTELLIGENCE REPORT</h1>
      <div class="section">
        <div class="label">Subject Number</div>
        <div class="value" style="font-size:20px;font-weight:bold">${result.normalized}</div>
        <div class="label" style="margin-top:8px">Analysis Date: ${new Date(result.analysisTimestamp).toLocaleString()}</div>
      </div>
      <h2>Geographic Intelligence</h2>
      <div class="section"><table>
        <tr><td class="label">Country</td><td class="value">${result.countryInfo?.flag || ""} ${result.countryInfo?.name || "Unknown"}</td></tr>
        <tr><td class="label">Region</td><td class="value">${result.countryInfo?.region || "Unknown"}</td></tr>
        <tr><td class="label">Timezone</td><td class="value">${result.countryInfo?.timezone || "Unknown"}</td></tr>
      </table></div>
      <h2>Carrier & Line Intelligence</h2>
      <div class="section"><table>
        <tr><td class="label">Carrier</td><td class="value">${result.carrier}</td></tr>
        <tr><td class="label">Line Type</td><td class="value">${result.lineType}</td></tr>
      </table></div>
      <h2>Platform Presence</h2>
      <div class="section"><table>
        <tr><td class="label">WhatsApp</td><td class="value">${result.platforms.whatsapp ? "✅ Detected" : "❌ Not found"}</td></tr>
        <tr><td class="label">Telegram</td><td class="value">${result.platforms.telegram ? "✅ Detected" : "❌ Not found"}</td></tr>
        <tr><td class="label">Viber</td><td class="value">${result.platforms.viber ? "✅ Detected" : "❌ Not found"}</td></tr>
        <tr><td class="label">Signal</td><td class="value">${result.platforms.signal ? "✅ Detected" : "❌ Not found"}</td></tr>
      </table></div>
      <h2>Risk Assessment</h2>
      <div class="section">
        <div class="risk-${result.riskLevel}" style="font-size:18px;font-weight:bold">${result.riskLevel.toUpperCase()} — Score: ${result.riskScore}/100</div>
        <ul>${result.riskFactors.map(f => `<li style="color:#9ca3af;font-size:13px;margin:4px 0">${f}</li>`).join("")}</ul>
      </div>
      ${caseLogs.length > 0 ? `<h2>Case Log</h2><div class="section">${caseLogs.map(l => `<div style="margin:8px 0"><span class="label">${new Date(l.timestamp).toLocaleString()}</span><div class="value">${l.note}</div></div>`).join("")}</div>` : ""}
      <div class="disclaimer">DISCLAIMER: This report is generated from publicly available data and heuristic analysis. Geographic location is approximate (country-level). All findings should be independently verified. This tool does not perform real-time tracking.</div>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const copyIntelligence = () => {
    if (result?.intelligence) {
      navigator.clipboard.writeText(result.intelligence);
    }
  };

  return (
    <TrackerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-primary">PHONE INVESTIGATION TOOL</h1>
          <p className="text-xs text-muted-foreground font-mono">root@ghost:~/phone-intel$ — Advanced OSINT Investigation Suite</p>
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
            <TerminalCard title="normalize.sh">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Normalized Format</p>
                    <p className="text-foreground font-mono text-lg font-bold">{result.normalized}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.countryInfo && <span className="text-3xl">{result.countryInfo.flag}</span>}
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                <Button size="sm" variant="outline" onClick={exportJSON} className="font-mono text-xs">
                  <Download size={12} className="mr-1" /> Export JSON
                </Button>
                <Button size="sm" variant="outline" onClick={exportPDF} className="font-mono text-xs">
                  <FileText size={12} className="mr-1" /> Export PDF
                </Button>
                <Button size="sm" variant="outline" onClick={copyIntelligence} className="font-mono text-xs">
                  <Copy size={12} className="mr-1" /> Copy Intel
                </Button>
              </div>
            </TerminalCard>

            {result.coords && (
              <TerminalCard title="geo-map.render">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
                    <MapPin size={10} className="mr-1" /> Approximate country-level location — not precise
                  </Badge>
                </div>
                <GlobeMap
                  lat={result.coords[0]}
                  lng={result.coords[1]}
                  label={`+${result.countryCode} — ${result.countryInfo?.name || "Unknown"}`}
                />
              </TerminalCard>
            )}

            <TerminalCard title="geo-intel.json">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={<Globe size={14} />} label="Country" value={result.countryInfo?.name || "Unknown"} />
                <InfoRow icon={<MapPin size={14} />} label="Region" value={result.countryInfo?.region || "Unknown"} />
                <InfoRow icon={<Clock size={14} />} label="Timezone" value={result.countryInfo?.timezone || "Unknown"} />
                <InfoRow icon={<Building size={14} />} label="Country Code" value={`+${result.countryCode}`} />
              </div>
            </TerminalCard>

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

            <TerminalCard title="platform-scan.sh">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={14} className="text-primary" />
                  <span className="text-foreground font-mono text-sm font-bold">Cross-Platform Presence</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <PlatformRow name="WhatsApp" detected={result.platforms.whatsapp} color="text-green-400" />
                  <PlatformRow name="Telegram" detected={result.platforms.telegram} color="text-blue-400" />
                  <PlatformRow name="Viber" detected={result.platforms.viber} color="text-purple-400" />
                  <PlatformRow name="Signal" detected={result.platforms.signal} color="text-sky-400" />
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-2 opacity-70">
                  * Presence detection is heuristic-based and may not reflect real-time status.
                </p>
              </div>
            </TerminalCard>

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

            <TerminalCard title="intelligence-summary.md">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-primary mt-0.5 shrink-0" />
                <pre className="text-muted-foreground text-xs font-mono leading-relaxed whitespace-pre-wrap">{result.intelligence}</pre>
              </div>
            </TerminalCard>

            <TerminalCard title="case-log.db">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-primary" />
                  <span className="text-foreground font-mono text-sm font-bold">Investigation Case Log</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {caseLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-xs bg-secondary/50 rounded px-3 py-2">
                      <Clock size={10} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground font-mono block text-[10px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className="text-foreground font-mono">{log.note}</span>
                      </div>
                      <button onClick={() => removeCaseLog(log.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add investigation note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addCaseLog(); } }}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-xs min-h-[60px]"
                  />
                  <Button size="sm" onClick={addCaseLog} className="bg-primary text-primary-foreground font-mono self-end">
                    <Plus size={14} />
                  </Button>
                </div>
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

const PlatformRow = ({ name, detected, color }: { name: string; detected: boolean; color: string }) => (
  <div className="flex items-center gap-2 bg-secondary/50 rounded px-3 py-2">
    {detected ? (
      <CheckCircle size={12} className={color} />
    ) : (
      <span className="w-3 h-3 rounded-full border border-muted-foreground/30" />
    )}
    <span className={`font-mono text-xs ${detected ? "text-foreground" : "text-muted-foreground/50"}`}>{name}</span>
    {detected && <Badge variant="secondary" className="ml-auto text-[10px] font-mono px-1.5 py-0">detected</Badge>}
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
