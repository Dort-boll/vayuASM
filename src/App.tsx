import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShieldAlert, 
  Cpu, 
  Globe2, 
  Network, 
  Clock, 
  Zap, 
  Layers, 
  Sliders, 
  MessageSquare, 
  CornerDownLeft, 
  Activity, 
  ChevronRight, 
  MapPin, 
  Hash, 
  Terminal, 
  Compass, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Dna,
  Link,
  Info,
  ExternalLink,
  BookOpen,
  Filter,
  User,
  Sparkles,
  ArrowLeft,
  Settings,
  Radio
} from 'lucide-react';
import { IntelProfile, ThreatVerdict, GraphNode, GraphLink } from './types';
import { getProfile } from './intelStore';
import GlossyCard from './components/GlossyCard';
import RssFeedsPanel from './components/RssFeedsPanel';
import SecureGateway from './components/SecureGateway';

export default function App() {
  // Navigation & View State
  const [viewMode, setViewMode] = useState<'landing' | 'results'>('landing');
  const [resultsTab, setResultsTab] = useState<'overview' | 'attack-surface' | 'ai-analyst' | 'threat-feeds'>('overview');
  
  // Authentication & Gate State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('vayu_unlocked') === 'true';
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<number>(0);
  const [operatorHandle, setOperatorHandle] = useState<string>('THREAT_HUNTER_01');
  const [decryptToken, setDecryptToken] = useState<string>('C-S&AW-SECURE-CTI-TOKEN');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  
  const loginSectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const lockConsole = () => {
    sessionStorage.removeItem('vayu_unlocked');
    setIsUnlocked(false);
  };

  const startVerificationChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;
    
    setIsVerifying(true);
    setVerificationStep(0);
    setVerificationLogs([
      `[${new Date().toLocaleTimeString()}] INIT: Initializing secure handshake request to gate.rudratech.com...`,
    ]);
    
    const steps = [
      {
        log: "ENV_CHECK: Auditing operator browser headers & canvas fingerprint integrity...",
        delay: 800
      },
      {
        log: "ROUTE_TEST: Negotiating TLS 1.3 encrypted tunnel over port 443 with Rudratech C-S&AW gateway...",
        delay: 1500
      },
      {
        log: "CRYPTO_EVAL: Verifying secure decrypted key block authorization token...",
        delay: 2300
      },
      {
        log: "CTI_RECON: Synchronizing decentralized threat feeds and live honeypot matrices...",
        delay: 3100
      },
      {
        log: "SYS_SYNC: Handshake authorized. Allocating client container footprint with 100% serverless frontend optimization...",
        delay: 3800
      }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setVerificationStep(index + 1);
        setVerificationLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${step.log}`
        ]);
      }, step.delay);
    });

    setTimeout(() => {
      sessionStorage.setItem('vayu_unlocked', 'true');
      setIsUnlocked(true);
      setIsVerifying(false);
    }, 4500);
  };

  // Search parameters
  const [query, setQuery] = useState<string>('company.com');
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [profile, setProfile] = useState<IntelProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLandingSearchFocused, setIsLandingSearchFocused] = useState<boolean>(false);
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState<boolean>(false);
  
  // Threat Advisor & Browser API state
  const [advisoryTab, setAdvisoryTab] = useState<'briefing' | 'crypto' | 'device'>('briefing');
  const [cryptoAlgorithm, setCryptoAlgorithm] = useState<'SHA-256' | 'SHA-512' | 'SHA-1'>('SHA-256');
  const [cryptoSalt, setCryptoSalt] = useState<string>('VAYU-SECURE-SALT-2026');
  const [cryptoHash, setCryptoHash] = useState<string>('');
  const [isComputingCrypto, setIsComputingCrypto] = useState<boolean>(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [voicePitch, setVoicePitch] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  
  // Dynamic system simulation state
  const [systemTime, setSystemTime] = useState<string>('2026-06-10T05:12:53Z');
  const [activeSignalIndex, setActiveSignalIndex] = useState<number>(0);
  
  // Live simulated honeypot signals for ticker/feed
  const [liveSignals, setLiveSignals] = useState<Array<{
    id: string;
    time: string;
    type: string;
    val: string;
    status: 'MALICIOUS' | 'SUSPICIOUS' | 'UNKNOWN' | 'BENIGN';
  }>>([
    { id: '1', time: '09:12', type: 'MALWARE', val: 'AsyncRAT Payload v3.1', status: 'MALICIOUS' },
    { id: '2', time: '09:10', type: 'IP_SCAN', val: '185.12.92.102', status: 'SUSPICIOUS' },
    { id: '3', time: '09:08', type: 'ASN_ALERT', val: 'AS136787 routes updated', status: 'UNKNOWN' },
    { id: '4', time: '09:05', type: 'URL_NEW', val: 'cdn.v-auth.ru/payload.exe', status: 'MALICIOUS' },
    { id: '5', time: '09:01', type: 'CAMPAIGN', val: '#STEALER_X Active Hook', status: 'MALICIOUS' },
    { id: '6', time: '08:55', type: 'EXPOSURE', val: 'Port 8080 open on company.com', status: 'SUSPICIOUS' },
    { id: '7', time: '08:52', type: 'GEO_RECON', val: 'RU -> US State Department Target', status: 'MALICIOUS' }
  ]);

  // Filters for Threat Hunt Workspace (Results tab)
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  // Threat hunter pre-filled database indicators
  const huntIndicators = [
    { value: '45.83.193.22', type: 'IP', risk: 94, verdict: 'MALICIOUS', geo: 'Russia (RU)', asn: 'AS136787' },
    { value: '194.26.135.11', type: 'IP', risk: 98, verdict: 'MALICIOUS', geo: 'Netherlands (NL)', asn: 'AS51765' },
    { value: 'company.com', type: 'DOMAIN', risk: 32, verdict: 'SUSPICIOUS', geo: 'United States (US)', asn: 'AS15169' },
    { value: 'asyncrat', type: 'MALWARE', risk: 95, verdict: 'MALICIOUS', geo: 'Multi-Source', asn: 'AS12345' },
    { value: 'cve-2024-3094', type: 'CVE', risk: 100, verdict: 'MALICIOUS', geo: 'Global', asn: 'AS0' },
    { value: '84.34.11.23', type: 'IP', risk: 78, verdict: 'MALICIOUS', geo: 'China (CN)', asn: 'AS41223' },
    { value: 'payment-portal-secured.com', type: 'DOMAIN', risk: 82, verdict: 'MALICIOUS', geo: 'Brazil (BR)', asn: 'AS28422' },
    { value: 'as136787', type: 'ASN', risk: 78, verdict: 'SUSPICIOUS', geo: 'Russia (RU)', asn: 'AS136787' },
    { value: '92.12.213.44', type: 'IP', risk: 14, verdict: 'BENIGN', geo: 'United Kingdom (GB)', asn: 'AS1245' }
  ];

  // Canvas References
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live system clock updater
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set up live signal random generation
  useEffect(() => {
    const signalInterval = setInterval(() => {
      const liveIPs = [
        '103.14.92.11', '185.22.45.19', '201.243.12.89', '94.200.12.11', 
        '45.83.193.24', '194.26.135.13', '110.233.12.1'
      ];
      const malwareTypes = ['Lumma Payload', 'RedLine Stealer', 'Vidar C2', 'AsyncRAT TCP Drop', 'Agent Tesla Trigger'];
      const actions = ['Port block alert', 'Exfiltration handshake', 'SSL certificate fraud', 'DDoS flood scan', 'BGP route shift'];
      const statTypes = ['MALICIOUS', 'SUSPICIOUS', 'UNKNOWN'] as const;

      const randomIP = liveIPs[Math.floor(Math.random() * liveIPs.length)];
      const randomMal = malwareTypes[Math.floor(Math.random() * malwareTypes.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomStatus = statTypes[Math.floor(Math.random() * statTypes.length)];

      const typesList = ['MALWARE', 'IP_SCAN', 'ASN_ALERT', 'EXPOSURE', 'CAMPAIGN'];
      const selectedType = typesList[Math.floor(Math.random() * typesList.length)];

      let displayVal = `${randomIP} -> ${randomAction}`;
      if (selectedType === 'MALWARE') displayVal = `${randomMal} staged on ${randomIP}`;
      else if (selectedType === 'CAMPAIGN') displayVal = `Active Campaign: #${randomMal.toUpperCase().replace(' ', '_')}`;

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

      const newSignal = {
        id: String(Date.now()),
        time: timeStr,
        type: selectedType,
        val: displayVal,
        status: randomStatus
      };

      setLiveSignals(prev => [newSignal, ...prev.slice(0, 7)]);
      setActiveSignalIndex(prev => (prev + 1) % 100);
    }, 6000);

    return () => clearInterval(signalInterval);
  }, []);

  // Fetch / Resolve Profile
  const fetchIntelProfile = async (targetQuery: string) => {
    if (!targetQuery.trim()) return;
    setLoading(true);

    const userGreyNoiseKey = localStorage.getItem('vayu_greynoise_key');
    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(targetQuery.trim());

    if (userGreyNoiseKey && isIP) {
      try {
        const proxy = localStorage.getItem('vayu_cors_proxy') || 'https://api.allorigins.win/raw?url=';
        const targetUrl = `https://api.greynoise.io/xapi/v1/public/ip/${targetQuery.trim()}`;
        const res = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`, {
          headers: {
            'key': userGreyNoiseKey
          }
        });

        if (res.ok) {
          const greyData = await res.json();
          const riskFactor = greyData.classification === 'malicious' ? 95 : greyData.classification === 'suspicious' ? 65 : greyData.classification === 'benign' ? 5 : 20;
          const threatVerdict: ThreatVerdict = greyData.classification === 'malicious' ? 'MALICIOUS' : greyData.classification === 'suspicious' ? 'SUSPICIOUS' : greyData.classification === 'benign' ? 'BENIGN' : 'UNKNOWN';
          
          const liveProfile: IntelProfile = {
            query: greyData.ip,
            type: "IP",
            riskScore: riskFactor,
            verdict: threatVerdict,
            country: greyData.country || "Unknown Location",
            countryCode: greyData.country_code || "XX",
            asn: greyData.asn || "AS00000",
            provider: greyData.organization || "Direct Ingestion Provider",
            urlsCount: greyData.bot ? 34 : 0,
            domainsCount: 1,
            firstSeen: greyData.first_seen || new Date().toISOString(),
            lastSeen: greyData.last_seen || new Date().toISOString(),
            exposureScore: greyData.classification === 'malicious' ? 90 : 45,
            openPorts: [80, 443],
            subdomains: [`host-${greyData.ip.replace(/\./g, '-')}.in-addr.arpa`],
            certAge: "Valid",
            techStack: ["Linux", "Embedded Web Server"],
            banners: ["TCP active banner verified via GreyNoise"],
            dnsRecords: [{ type: "A", name: `ip-${greyData.ip}`, value: greyData.ip }],
            threatDna: [
              { category: "GreyNoise Ingest", score: 95, description: `Live GreyNoise IP Classification is ${greyData.classification}.` },
              { category: "Noise Status", score: greyData.noise ? 80 : 20, description: greyData.noise ? "IP belongs to a known internet scanner or noise generator." : "Target exhibits targeted direct peer traffic." },
              { category: "Geopolitics", score: 50, description: `Originating from autonomous system ${greyData.asn}.` }
            ],
            timeline: [
              { date: greyData.last_seen || "2026-07-07", event: `Ingested live reputation: classification set to ${greyData.classification}`, status: greyData.classification === 'malicious' ? 'critical' : 'info' }
            ],
            nodes: [
              { id: greyData.ip, label: greyData.ip, type: "IP", risk: riskFactor },
              { id: greyData.asn, label: `${greyData.asn} (${greyData.organization})`, type: "ASN" }
            ],
            links: [
              { source: greyData.ip, target: greyData.asn, label: "routes_via" }
            ],
            summary: `Live GreyNoise intelligence lookup completed. Host is classified as ${greyData.classification}. ${greyData.actor ? `Attributed actor group: ${greyData.actor}.` : 'No direct APT group attribution registered.'}`
          };

          setProfile(liveProfile);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Direct live GreyNoise fetch failed, falling back to backend/local cached profiles.", err);
      }
    }

    // Direct client-side intelligence compilation - 100% frontend optimized
    try {
      // Allow minor delay for user interface scanner sweep animations
      await new Promise(resolve => setTimeout(resolve, 600));
      const data = getProfile(targetQuery);
      setProfile(data);
    } catch (err) {
      console.error("CTI compilation error", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search profile when query state moves
  useEffect(() => {
    fetchIntelProfile(query);
  }, [query]);

  // Load browser device diagnostic using browser-based APIs
  useEffect(() => {
    const loadDiagnostics = async () => {
      const info: any = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: (navigator as any).userAgentData?.platform || navigator.platform || "Unknown OS",
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        deviceMemory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "Not available",
        cpuThreads: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Threads` : "Not available",
        cryptoSupported: !!window.crypto && !!window.crypto.subtle ? "FULLY SUPPORTED" : "UNSUPPORTED",
        speechSupported: 'speechSynthesis' in window ? "FULLY SUPPORTED" : "UNSUPPORTED",
        connectionType: (navigator as any).connection?.effectiveType || "Not available",
        downlink: (navigator as any).connection?.downlink ? `${(navigator as any).connection?.downlink} Mbps` : "Not available",
        rtt: (navigator as any).connection?.rtt ? `${(navigator as any).connection?.rtt} ms` : "Not available",
      };
      setDeviceInfo(info);
    };
    if (isUnlocked) {
      loadDiagnostics();
    }
  }, [isUnlocked]);

  // Compute Cryptographic Verification Signature via Web Crypto API
  const computeCryptographicSignature = async () => {
    if (!profile) return;
    setIsComputingCrypto(true);
    try {
      const dataString = JSON.stringify(profile) + cryptoSalt;
      const encoder = new TextEncoder();
      const data = encoder.encode(dataString);
      const hashBuffer = await window.crypto.subtle.digest(cryptoAlgorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      // Delay to simulate computation
      await new Promise(resolve => setTimeout(resolve, 500));
      setCryptoHash(hashHex);
    } catch (err) {
      console.error("Web Crypto API signature failed:", err);
      setCryptoHash("SIGNATURE_COMPILATION_ERROR");
    } finally {
      setIsComputingCrypto(false);
    }
  };

  // Re-compute crypto hash when target profile changes, or salt changes, or algorithm changes
  useEffect(() => {
    if (profile) {
      computeCryptographicSignature();
    }
  }, [profile, cryptoAlgorithm, cryptoSalt]);

  // Read tactical briefing using Web Speech Synthesis API
  const speakBriefing = () => {
    if (!profile || !('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const reportText = `Vayu Tactical Threat Report. Target ${profile.query}. Verdict is ${profile.verdict}. Risk score is ${profile.riskScore} out of 100. Geopolitical origin is ${profile.country}. Operator ASN is ${profile.asn}. Summary: ${profile.summary}. Remediation advice includes configuring edge router blocks and DNS cache poison sinkholes.`;
    
    const utterance = new SpeechSynthesisUtterance(reportText);
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;
    
    const voices = window.speechSynthesis.getVoices();
    const synthVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Female") || v.lang.startsWith("en-US")) || voices[0];
    if (synthVoice) {
      utterance.voice = synthVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Render Interactive Radar Telemetry Canvas
  useEffect(() => {
    if (viewMode !== 'results' || resultsTab !== 'overview') return;
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scanAngle = 0;
    const dots = [
      { x: 120, y: 50, r: 4, opacity: 0.8, label: 'RU C2 NODE Active', pings: true },
      { x: 300, y: 120, r: 3, opacity: 0.4, label: 'US IP Proxy Staging', pings: false },
      { x: 190, y: 40, r: 5, opacity: 0.9, label: 'NL Lumma Panel Host', pings: true },
      { x: 60, y: 110, r: 3, opacity: 0.4, label: 'BR Endpoint', pings: false },
      { x: 320, y: 50, r: 3, opacity: 0.5, label: 'APAC Gateway Root', pings: false }
    ];

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const rMax = Math.min(cx, cy) - 20;

      // Draw radar scanner ranges
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let r = 25; r <= rMax; r += 35) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - rMax, cy);
      ctx.lineTo(cx + rMax, cy);
      ctx.moveTo(cx, cy - rMax);
      ctx.lineTo(cx, cy + rMax);
      ctx.stroke();

      // Sweep line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const sweepX = cx + Math.cos(scanAngle) * rMax;
      const sweepY = cy + Math.sin(scanAngle) * rMax;
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Scanner gradient sweep slice
      const grad = ctx.createRadialGradient(cx, cy, 3, cx, cy, rMax);
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.12)');
      grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rMax, scanAngle - 0.5, scanAngle);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // Draw tactical spots
      dots.forEach(dot => {
        ctx.fillStyle = dot.pings ? 'rgba(255, 61, 113, ' + dot.opacity + ')' : 'rgba(0, 229, 255, ' + dot.opacity + ')';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();

        if (dot.pings) {
          ctx.strokeStyle = 'rgba(255, 61, 113, 0.35)';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r + (Math.sin(Date.now() / 150) * 3 + 3), 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '8px monospace';
        ctx.fillText(dot.label, dot.x + 8, dot.y + 3);
      });

      scanAngle += 0.015;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [viewMode, resultsTab]);

  // Render VAYU Graph Canvas (Intel Pivot Explorer)
  useEffect(() => {
    if (viewMode !== 'results' || resultsTab !== 'overview' || !profile) return;
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const nodes = profile.nodes.map((n, idx) => ({
      ...n,
      x: 100 + (idx * 65) % (canvas.width - 120) + (Math.sin(idx) * 20),
      y: 40 + ((idx * 45) + 30) % (canvas.height - 80) + (Math.cos(idx) * 15),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    }));

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid matrix system background
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.025)';
      ctx.lineWidth = 1;
      const spacing = 18;
      for (let i = 0; i < canvas.width; i += spacing) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += spacing) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
      }

      // Physics constraints
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 30 || node.x > canvas.width - 30) node.vx *= -1;
        if (node.y < 30 || node.y > canvas.height - 30) node.vy *= -1;
      });

      // Draw connection wires
      profile.links.forEach(link => {
        const srcNode = nodes.find(n => n.id === link.source);
        const tgtNode = nodes.find(n => n.id === link.target);

        if (srcNode && tgtNode) {
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.22)';
          ctx.lineWidth = 1;

          if (srcNode.risk && srcNode.risk > 70) {
            ctx.strokeStyle = 'rgba(255, 61, 113, 0.3)';
            ctx.lineWidth = 1.2;
          }

          ctx.beginPath();
          ctx.moveTo(srcNode.x, srcNode.y);
          ctx.lineTo(tgtNode.x, tgtNode.y);
          ctx.stroke();

          if (link.label) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.font = '7px monospace';
            ctx.fillText(link.label, (srcNode.x + tgtNode.x) / 2, (srcNode.y + tgtNode.y) / 2 - 3);
          }
        }
      });

      // Render physical intelligence nodes
      nodes.forEach(node => {
        let col = '#00E5FF'; // Cyan
        if (node.type === 'MALWARE') col = '#8B5CF6'; // Violet
        if (node.type === 'CAMPAIGN') col = '#FF3D71'; // Rose
        if (node.risk && node.risk >= 70) col = '#FF3D71'; 
        if (node.type === 'ASN') col = '#00D97E'; // Green
        if (node.type === 'COUNTRY') col = '#64748b'; // Slate

        // Glowing backdrop
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Inner dark core
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // High contrast labeling
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.fillText(node.label.length > 20 ? node.label.substring(0, 18) + '..' : node.label, node.x + 11, node.y + 3);

        ctx.fillStyle = 'rgba(0, 229, 255, 0.55)';
        ctx.font = '7px monospace';
        ctx.fillText(`[${node.type}]`, node.x + 11, node.y + 10);
      });

      animFrame = requestAnimationFrame(drawGraph);
    };

    drawGraph();
    return () => cancelAnimationFrame(animFrame);
  }, [profile, viewMode, resultsTab]);

  // Hunt workspace list parsing
  const filteredHuntIndicators = huntIndicators.filter(item => {
    if (selectedRiskFilter === 'MALICIOUS_ONLY' && item.verdict !== 'MALICIOUS') return false;
    if (selectedRiskFilter === 'SUSPICIOUS_ONLY' && item.verdict !== 'SUSPICIOUS') return false;
    if (selectedTypeFilter !== 'ALL' && item.type !== selectedTypeFilter) return false;
    if (selectedCountryFilter !== 'ALL') {
      if (selectedCountryFilter === 'RU' && !item.geo.toLowerCase().includes('russia')) return false;
      if (selectedCountryFilter === 'US' && !item.geo.toLowerCase().includes('united states')) return false;
      if (selectedCountryFilter === 'NL' && !item.geo.toLowerCase().includes('netherlands')) return false;
    }
    return true;
  });

  // Action: Launch regular target search
  const triggerSearchQuery = (target: string) => {
    const cleaned = target.trim();
    if (!cleaned) return;
    setQuery(cleaned);
    setSearchInputValue(cleaned);
    setViewMode('results');
  };

  // Action: Launch Live Attack Surface directly loaded
  const triggerLiveAttackSurface = (target: string) => {
    const cleaned = target.trim();
    if (!cleaned) return;
    setQuery(cleaned);
    setSearchInputValue(cleaned);
    setViewMode('results');
    setResultsTab('attack-surface');
  };

  // Form Submission
  const handleFormSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setViewMode('results');
      setQuery(searchInputValue);
    }
  };

  return (
    <div id="vayu-root" className="min-h-screen bg-black text-[#e2e8f0] font-sans flex flex-col relative select-none overflow-x-hidden scanline">
      {/* Background Matrix Dust Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00E5FF 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* FIXED GLOBAL NAV CONTAINER (GUARANTEES HEADER AND TICKER STICK TO TOP) */}
      {isUnlocked && (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        {/* GLASS BLUR HEADER */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 bg-black/60 backdrop-blur-xl transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('landing')}>
            <div className="w-10 h-10 border-2 border-[#00E5FF] flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.4)] relative bg-black">
              <div className="w-3.5 h-3.5 bg-[#FF3D71] animate-ping absolute rounded-full opacity-60"></div>
              <div className="w-3 h-3 bg-[#FF3D71]"></div>
              <div className="absolute w-full h-full border border-[#8B5CF6] scale-110 opacity-30"></div>
            </div>
            <div className="leading-none">
              <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-1.5">
                VAYU <span className="text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.5)]">ASM</span>
              </h1>
              <p className="text-[8px] uppercase tracking-[0.3em] font-mono text-[#8B5CF6]">GreyNoise Integration v4.5</p>
            </div>
          </div>

          {/* Dynamic header items dependent on mode */}
          {viewMode === 'results' ? (
            <div className="flex-1 max-w-xl px-8 hidden md:block">
              <form onSubmit={handleFormSearchSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-sm blur-sm opacity-40 group-hover:opacity-100 transition duration-300"></div>
                <div className={`relative flex items-center bg-black/90 border ${isHeaderSearchFocused ? 'border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]' : 'border-[#00E5FF]/40'} px-3 py-1.5 transition-all duration-300`}>
                  <div className="flex items-center gap-1 text-[#00E5FF] mr-2 shrink-0">
                    <Terminal className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-white/20 font-mono text-xs select-none">//</span>
                  </div>
                  <input 
                    type="text" 
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    onFocus={() => setIsHeaderSearchFocused(true)}
                    onBlur={() => setIsHeaderSearchFocused(false)}
                    placeholder="Query IP, Domain, Malware, Campaign, CVE..." 
                    className="w-full bg-transparent text-xs font-mono tracking-widest text-white placeholder-[#00E5FF]/20 outline-none focus:text-[#00E5FF]"
                  />
                  {loading && <RefreshCw className="w-3 h-3 text-[#00E5FF] animate-spin ml-2" />}
                  <button type="submit" className="hidden">SWEEP</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-6">
              <span className="text-[10px] font-mono text-white/40 tracking-widest">// AUTOMATED SCANNING NODE INGESTION: ACTIVE</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isUnlocked ? (
              <>
                {/* Header Action Gateways */}
                <button 
                  onClick={() => triggerLiveAttackSurface('company.com')}
                  className="hidden sm:flex items-center gap-1.5 bg-[#FF3D71]/10 text-[#FF3D71] hover:bg-[#FF3D71] hover:text-white px-3 py-1.5 border border-[#FF3D71]/30 text-xs font-mono font-bold tracking-tight transition-all uppercase rounded-sm"
                  id="header-live-asm-trigger"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Live Attack Surface
                </button>

                {viewMode === 'results' && (
                  <button 
                    onClick={() => setViewMode('landing')}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all font-mono"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Engine Home</span>
                  </button>
                )}

                <button 
                  onClick={lockConsole}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:text-[#FF3D71] hover:border-[#FF3D71]/50 transition-all font-mono rounded-sm"
                  title="Lock Threat Intelligence Console"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00D97E] animate-ping"></span>
                  <span className="hidden md:inline">Lock Console</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF3D71]/10 border border-[#FF3D71]/30 rounded-sm font-mono text-[10px] text-[#FF3D71] uppercase tracking-wider animate-pulse">
                <span>// GATEWAY SECURED</span>
              </div>
            )}
          </div>
        </header>

        {/* ROLING BROADCAST TICKER CHANNEL (AVAILABLE THROUGHOUT THE FOOTPRINT) */}
        {isUnlocked && (
          <div className="bg-black/80 backdrop-blur-md border-b border-[#00E5FF]/10 h-10 px-6 flex items-center justify-between text-[10px] font-mono overflow-hidden relative">
            <div className="flex items-center gap-2 text-[#00E5FF] shrink-0 uppercase font-black tracking-wide border-r border-[#00E5FF]/20 pr-4 mr-4">
              <Terminal className="w-3 h-3 text-[#00E5FF] animate-pulse" />
              Live Threat Feed
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-12 whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
                {liveSignals.map((sig, i) => (
                  <span 
                    key={i} 
                    onClick={() => triggerSearchQuery(sig.val.split(' ')[0])}
                    className="inline-flex items-center gap-2 hover:text-[#00E5FF] transition-colors"
                  >
                    <span className="text-[#8B5CF6] font-bold">[{sig.time}]</span>
                    <span className="text-white/80">{sig.val}</span>
                    <span className={`text-[8.5px] px-1 font-bold ${
                      sig.status === 'MALICIOUS' ? 'bg-[#FF3D71]/10 text-[#FF3D71] border border-[#FF3D71]/20' :
                      sig.status === 'SUSPICIOUS' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20' :
                      'bg-white/5 text-white/50 border border-white/10'
                    }`}>{sig.status}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-white/30 pl-4 shrink-0 font-mono text-[9px] border-l border-white/10">
              <span>THREAT MARKS: 1,310/SEC</span>
              <span className="text-[#00D97E] animate-pulse">● SYNCED</span>
            </div>
          </div>
        )}
        </div>
      )}

      {/* MAIN CONTAINER PANELS */}
      <div className={`flex-1 flex flex-col justify-start ${isUnlocked ? 'pt-[120px]' : 'pt-0'}`}>
        {!isUnlocked ? (
          <SecureGateway 
            onUnlock={() => {
              sessionStorage.setItem('vayu_unlocked', 'true');
              setIsUnlocked(true);
            }} 
            systemTime={systemTime} 
          />
        ) : (
          <>
            {/* VIEW 1: LANDING PAGE - DEEP GREYNOISE COZIED VIEW */}
            {viewMode === 'landing' && (
          <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
            
            {/* Massive Tech Scanner Lines background layout */}
            <div className="absolute inset-x-0 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF]/25 to-transparent animate-pulse"></div>
            
            <div className="w-full max-w-4xl text-center flex flex-col items-center z-10 my-auto py-8">
              
              {/* Vayu Brand Icon Layout */}
              <div className="mb-6 relative flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-dashed border-[#00E5FF]/40 rounded-full animate-spin [animation-duration:40s]"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-black to-black border border-[#00E5FF]/50 flex items-center justify-center absolute rounded-md shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                  <ShieldAlert className="w-8 h-8 text-[#00E5FF] animate-pulse" />
                </div>
              </div>

              {/* Bold Display Typography Headers */}
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 uppercase leading-none">
                ATTACK SURFACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FF3D71] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">INTELLIGENCE</span>
              </h2>
              <p className="max-w-2xl font-mono text-[#e2e8f0]/60 text-sm md:text-base leading-relaxed tracking-wider mb-10">
                Identify rogue hosts, evaluate shadow IT registries, discover exposed ports, and instantly query full-scope grey internet activity.
              </p>

              {/* GIGANTIC CENTERED GREYNOISE SEARCH BOX */}
              <div className="w-full max-w-2xl px-4 mb-4">
                <form onSubmit={handleFormSearchSubmit} className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FF3D71] rounded blur transition duration-300 ${isLandingSearchFocused ? 'opacity-100 shadow-[0_0_30px_rgba(0,229,255,0.4)]' : 'opacity-65'}`}></div>
                  <div className={`relative flex flex-col sm:flex-row sm:items-center bg-black/95 border ${isLandingSearchFocused ? 'border-[#00E5FF]' : 'border-[#00E5FF]/40'} p-3.5 sm:px-5 sm:py-4 transition-all duration-300 gap-3 sm:gap-0`}>
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex items-center gap-2 mr-3 sm:mr-4 shrink-0 text-[#00E5FF]">
                        <Terminal className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                        <span className="text-white/30 font-mono text-xs sm:text-base select-none font-bold">//</span>
                      </div>
                      <input 
                        type="text" 
                        value={searchInputValue}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        onFocus={() => setIsLandingSearchFocused(true)}
                        onBlur={() => setIsLandingSearchFocused(false)}
                        placeholder="ENTER IP, DOMAIN, MALWARE CAMPAIGN OR CVE..." 
                        className="w-full bg-transparent text-xs sm:text-sm md:text-base font-mono tracking-wider sm:tracking-widest text-[#00E5FF] placeholder-[#00E5FF]/20 outline-none uppercase font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-xs font-mono text-[9px] text-white/40 mr-4 uppercase tracking-widest select-none">
                        <span>QUERY_ACTIVE</span>
                      </div>
                      <button 
                        type="submit"
                        className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-black font-mono font-black py-2 px-5 sm:py-2.5 sm:px-6 tracking-wide hover:from-[#00D97E] hover:to-[#00E5FF] transform active:scale-95 transition-all text-xs sm:text-sm rounded-sm uppercase"
                      >
                        SWEEP ENGINE
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* POPULAR THREAT RECOMMENDATIONS & PRESETS */}
              <div className="mb-12">
                <span className="text-[10px] font-mono tracking-widest text-white/40 block mb-2 font-bold uppercase">// DISCOVERABLE INTELLIGENCE SAMPLES</span>
                <div className="flex flex-wrap justify-center gap-2 px-6">
                  <button 
                    onClick={() => triggerSearchQuery('company.com')}
                    className="bg-black/40 hover:bg-[#00E5FF]/10 text-xs font-mono text-white/80 hover:text-[#00E5FF] py-1.5 px-3 border border-white/10 hover:border-[#00E5FF]/50 transition-all rounded-sm flex items-center gap-1"
                  >
                    <span>company.com</span>
                    <span className="text-[9px] opacity-40 bg-white/15 px-1 font-sans">DEMO DOMAIN</span>
                  </button>
                  <button 
                    onClick={() => triggerSearchQuery('45.83.193.22')}
                    className="bg-black/40 hover:bg-[#FF3D71]/10 text-xs font-mono text-white/80 hover:text-[#FF3D71] py-1.5 px-3 border border-white/10 hover:border-[#FF3D71]/50 transition-all rounded-sm flex items-center gap-1"
                  >
                    <span>45.83.193.22</span>
                    <span className="text-[9.5px] text-[#FF3D71] font-bold font-sans">AsyncRAT</span>
                  </button>
                  <button 
                    onClick={() => triggerSearchQuery('194.26.135.11')}
                    className="bg-black/40 hover:bg-[#8B5CF6]/10 text-xs font-mono text-white/80 hover:text-[#8B5CF6] py-1.5 px-3 border border-white/10 hover:border-[#8B5CF6]/50 transition-all rounded-sm flex items-center gap-1"
                  >
                    <span>194.26.135.11</span>
                    <span className="text-[9.5px] text-[#8B5CF6] font-bold font-sans">Lumma C2</span>
                  </button>
                  <button 
                    onClick={() => triggerSearchQuery('cve-2024-3094')}
                    className="bg-black/40 hover:bg-[#00D97E]/10 text-xs font-mono text-white/80 hover:text-[#00D97E] py-1.5 px-3 border border-white/10 hover:border-[#00D97E]/50 transition-all rounded-sm flex items-center gap-1"
                  >
                    <span>CVE-2024-3094</span>
                    <span className="text-[9.5px] text-[#00D97E] font-bold font-sans">XZ Utils</span>
                  </button>
                </div>
              </div>

              {/* FOUR-COLUMN GRAPHIC ROADMAP BENTO MATRIX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left px-4">
                
                {/* BENTO CARD 1: LIVE ATTACK SURFACE GATEWAY */}
                <GlossyCard 
                  glowColor="rose"
                  onClick={() => triggerLiveAttackSurface('company.com')}
                  className="p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-sm bg-[#FF3D71]/10 flex items-center justify-center border border-[#FF3D71]/25 text-[#FF3D71]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-[#FF3D71] transition-colors leading-tight">
                      Live Attack Surface Audit
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    Scan networks instantly. Audit exposed subdomains, active ports configurations, open server banners and TLS compliance profiles.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#FF3D71] font-bold">
                    <span>LAUNCH PORTAL // SWEEP</span>
                    <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlossyCard>

                {/* BENTO CARD 2: RADAR & RELATIONSHIP GRAPH */}
                <GlossyCard 
                  glowColor="cyan"
                  onClick={() => triggerSearchQuery('45.83.193.22')}
                  className="p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-sm bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/25 text-[#00E5FF]">
                      <Network className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-[#00E5FF] transition-colors leading-tight">
                      VAYU Pivot Network Graph
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    Explore high fidelity peer mappings, C2 routing frameworks, affiliate campaigns, domain pivots and geolocation.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#00E5FF] font-bold">
                    <span>EXPLORE CORRELATIONS</span>
                    <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlossyCard>

                {/* BENTO CARD 3: VAYU THREAT ADVISOR CONSOLE */}
                <GlossyCard 
                  glowColor="purple"
                  onClick={() => {
                    setViewMode('results');
                    setResultsTab('threat-analyst');
                  }}
                  className="p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-sm bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/25 text-[#8B5CF6]">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-[#8B5CF6] transition-colors leading-tight">
                      VAYU Threat Advisor Core
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    Activate the local heuristic expert system. Play synthesized tactical voice readouts, verify cryptographically signed hashes, and audit operator environment diagnostics.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#8B5CF6] font-bold">
                    <span>OPEN ADVISOR CONSOLE</span>
                    <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlossyCard>

                {/* BENTO CARD 4: LIVE THREAT BROADCASTS */}
                <GlossyCard 
                  glowColor="green"
                  onClick={() => {
                    setViewMode('results');
                    setResultsTab('threat-feeds');
                  }}
                  className="p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-sm bg-[#00D97E]/10 flex items-center justify-center border border-[#00D97E]/25 text-[#00D97E]">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-[#00D97E] transition-colors leading-tight">
                      Live Threat News Feeds
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    Aggregate real-time cyber security broadcasts directly in-browser. Stream CISA warnings, Dark Reading articles, and CVE databases.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#00D97E] font-bold">
                    <span>STREAM THREAT BROADCASTS</span>
                    <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlossyCard>

              </div>

            </div>
          </main>
        )}

        {/* VIEW 2: FULL WORKSPACE INTEGRATION RESULT CORES */}
        {viewMode === 'results' && (
          <div className="flex-1 flex flex-col">
            
            {/* SUB NAVBAR MODE SELECTORS */}
            <nav className="bg-black/40 backdrop-blur-lg border-b border-white/10 px-6 py-2 sticky top-[120px] z-40 transition-all duration-300 ease-in-out shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono text-xs">
                
                {/* Tab selections */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setResultsTab('overview')}
                    className={`px-4 py-2 flex items-center gap-1.5 border font-bold transition-all ${
                      resultsTab === 'overview' 
                        ? 'border-[#00E5FF] text-white bg-[#00E5FF]/10 shadow-[0_0_10px_rgba(0,229,255,0.15)]' 
                        : 'border-white/10 text-white/50 hover:border-[#00E5FF]/50 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-4.5 h-4.5" />
                    <span>1. Threat Intel Report</span>
                  </button>
                  
                  <button 
                    onClick={() => setResultsTab('attack-surface')}
                    className={`px-4 py-2 flex items-center gap-1.5 border font-bold transition-all ${
                      resultsTab === 'attack-surface' 
                        ? 'border-[#FF3D71] text-white bg-[#FF3D71]/10 shadow-[0_0_10px_rgba(255,61,113,0.15)]' 
                        : 'border-white/10 text-white/50 hover:border-[#FF3D71]/50 hover:text-white'
                    }`}
                    id="results-live-asm-tab"
                  >
                    <Layers className="w-4.5 h-4.5" />
                    <span>2. Live Attack Surface Audit</span>
                  </button>
                  
                  <button 
                    onClick={() => setResultsTab('threat-analyst')}
                    className={`px-4 py-2 flex items-center gap-1.5 border font-bold transition-all ${
                      resultsTab === 'threat-analyst' 
                        ? 'border-[#8B5CF6] text-white bg-[#8B5CF6]/10 shadow-[0_0_10px_rgba(139,92,246,0.15)]' 
                        : 'border-white/10 text-white/50 hover:border-[#8B5CF6]/50 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-4.5 h-4.5" />
                    <span>3. Threat Advisor Core</span>
                  </button>

                  <button 
                    onClick={() => setResultsTab('threat-feeds')}
                    className={`px-4 py-2 flex items-center gap-1.5 border font-bold transition-all ${
                      resultsTab === 'threat-feeds' 
                        ? 'border-[#00D97E] text-white bg-[#00D97E]/10 shadow-[0_0_10px_rgba(0,217,126,0.15)]' 
                        : 'border-white/10 text-white/50 hover:border-[#00D97E]/50 hover:text-white'
                    }`}
                  >
                    <Radio className="w-4.5 h-4.5" />
                    <span>4. Threat Feeds</span>
                  </button>
                </div>

                {/* Scope Query Status indicator bar */}
                <div className="text-right flex items-center gap-2 self-end sm:self-auto bg-white/5 border border-white/10 px-3 py-1 text-[10px]">
                  <span className="opacity-40 uppercase">ACTIVE TARGET FOCUS:</span>
                  <span className="text-[#00E5FF] font-black">{profile ? profile.query : 'RESOLVING...'}</span>
                </div>

              </div>
            </nav>

            {/* RESULTS SCREEN CONTENT CHANNELS */}
            {profile ? (
              <div id="results-display-port" className="p-4 flex-1 lg:grid lg:grid-cols-12 gap-4">
                
                {/* TAB CHASSIS 1 (OVERVIEW INTEL) */}
                {resultsTab === 'overview' && (
                  <>
                    {/* LEFT RUN TIME CORES - TELEMETRY & SUBDOCKS */}
                    <aside className="lg:col-span-3 flex flex-col gap-4">
                      
                      {/* THREAT DNA GRAPHIC SUMMARY */}
                      <GlossyCard glowColor="cyan" className="p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 bg-white/5 text-[8px] font-mono text-white/40">// SCAN_DNA_GRID</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5 mb-3">
                          <Dna className="w-3.5 h-3.5" />
                          Threat DNA Profile
                        </h3>

                        {/* Animated Visual Rotating Helix Core */}
                        <div className="flex flex-col items-center justify-center py-6 relative">
                          <div className="absolute w-36 h-36 border border-[#00E5FF]/5 rounded-full animate-spin [animation-duration:12s]"></div>
                          <div className="absolute w-28 h-28 border border-[#8B5CF6]/10 rounded-full animate-spin [animation-duration:8s] reverse-spin"></div>
                          
                          <div className="relative w-14 h-14 bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-white" />
                          </div>

                          <div className="mt-4 text-center select-text">
                            <span className="text-[9px] font-mono text-white/40 block">STABILITY CODE:</span>
                            <span className="text-xs font-mono font-bold text-[#00E5FF]">
                              VAYU-{profile.countryCode}-{(profile.riskScore * 13).toString(16).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* List display */}
                        <div className="space-y-2 mt-2 max-h-[190px] overflow-y-auto">
                          {profile.threatDna.slice(0, 4).map((dnaPoint, idx) => (
                            <div key={idx} className="bg-white/[0.01] border-l border-white/20 p-2 hover:bg-white/5 transition-all">
                              <div className="flex justify-between text-[10px] font-mono leading-none mb-1">
                                <span className="opacity-60 text-white">{dnaPoint.category}</span>
                                <span className="text-[#00E5FF] font-black">{dnaPoint.score}/100</span>
                              </div>
                              <p className="text-[10px] text-white/70 truncate">{dnaPoint.description}</p>
                            </div>
                          ))}
                        </div>
                      </GlossyCard>

                      {/* QUICK FILTER PANEL WORKSPACE */}
                      <GlossyCard glowColor="purple" className="p-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5 mb-2">
                          <Compass className="w-3.5 h-3.5" />
                          Threat Hunt Filters
                        </h3>
                        <p className="text-[9.5px] font-mono text-white/40 mb-3">Configure criteria below to isolate network peers in the table:</p>
                        
                        <div className="space-y-2 text-[10px] font-mono">
                          <div>
                            <label className="text-white/30 block mb-1 uppercase text-[8px]">RISK CLASSIFICATION</label>
                            <select 
                              value={selectedRiskFilter} 
                              onChange={(e) => setSelectedRiskFilter(e.target.value)}
                              className="w-full bg-black border border-white/10 text-white p-1 outline-none focus:border-[#00E5FF]"
                            >
                              <option value="ALL">ALL VERDICTS</option>
                              <option value="MALICIOUS_ONLY">MALICIOUS ONLY</option>
                              <option value="SUSPICIOUS_ONLY">SUSPICIOUS ONLY</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-white/30 block mb-1 uppercase text-[8px]">GEOGRAPHIC ROUTING</label>
                            <select 
                              value={selectedCountryFilter} 
                              onChange={(e) => setSelectedCountryFilter(e.target.value)}
                              className="w-full bg-black border border-white/10 text-white p-1 outline-none focus:border-[#00E5FF]"
                            >
                              <option value="ALL">ANY REGION</option>
                              <option value="RU">RUSSIA (RU)</option>
                              <option value="US">UNITED STATES (US)</option>
                              <option value="NL">NETHERLANDS (NL)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-white/30 block mb-1 uppercase text-[8px]">RESOURCE CLASSIFICATION</label>
                            <select 
                              value={selectedTypeFilter} 
                              onChange={(e) => setSelectedTypeFilter(e.target.value)}
                              className="w-full bg-black border border-white/10 text-white p-1 outline-none focus:border-[#00E5FF]"
                            >
                              <option value="ALL">ALL TYPES</option>
                              <option value="IP">IP ENDPOINT</option>
                              <option value="DOMAIN">DOMAIN REGISTRY</option>
                              <option value="MALWARE">MALWARE CORE</option>
                              <option value="ASN">AUTOMATED NETWORK</option>
                            </select>
                          </div>
                        </div>
                      </GlossyCard>

                    </aside>

                    {/* CENTER COLUMN: VERDICTS & VISUALIZATIONS */}
                    <section className="col-span-12 lg:col-span-9 flex flex-col gap-4">
                      
                      {/* GLOWING PROFILE OVERVIEW MATRICES */}
                      <GlossyCard glowColor="cyan" className="p-6 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-right font-mono text-[9px] text-[#00E5FF]">
                          HOST CLASS: {profile.type}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          
                          {/* Radial Glow score index */}
                          <div className="md:col-span-3 flex flex-col items-center justify-center relative py-2">
                            <div className="absolute w-32 h-32 border border-[#00E5FF]/10 rounded-full"></div>
                            <div className="absolute w-24 h-24 border border-[#8B5CF6]/15 rounded-full animate-pulse"></div>
                            
                            <div className="text-center z-10 select-text">
                              <h2 className="text-4xl font-black font-display text-white leading-none">
                                {profile.riskScore}
                              </h2>
                              <p className="text-[8px] font-mono tracking-wider text-[#00E5FF] font-bold uppercase mt-1">INTEL SCORE</p>
                            </div>
                          </div>

                          {/* Specifics details */}
                          <div className="md:col-span-9 flex flex-col justify-center select-text">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 font-bold border ${
                                profile.verdict === 'MALICIOUS' ? 'bg-[#FF3D71]/15 border-[#FF3D71] text-[#FF3D71]' :
                                profile.verdict === 'SUSPICIOUS' ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6]' :
                                'bg-[#00D97E]/15 border-[#00D97E] text-[#00D97E]'
                              }`}>
                                {profile.verdict} VERDICT
                              </span>
                              <span className="text-[10px] font-mono text-white/40">GEO Provider: {profile.provider} ({profile.countryCode})</span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">{profile.query}</h3>
                            <p className="text-xs font-mono text-white/70 leading-relaxed mb-4">{profile.summary}</p>

                            <div className="flex flex-wrap gap-4 items-center border-t border-white/10 pt-3 text-[10px] font-mono">
                              <div className="flex items-center gap-1 text-white/50">
                                <Clock className="w-3.5 h-3.5" />
                                <span>First seen: {new Date(profile.firstSeen).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[#00E5FF]">
                                <Globe2 className="w-3.5 h-3.5" />
                                <span>ASN: {profile.asn}</span>
                              </div>
                              {profile.malwareFamily && (
                                <div className="flex items-center gap-1 text-[#8B5CF6]">
                                  <Sliders className="w-3.5 h-3.5" />
                                  <span>Family: {profile.malwareFamily}</span>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </GlossyCard>

                      {/* DOUBLE INTERACTIVE CANVAS PLOTS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* WIDGET A: VAYU GRAPH CANVAS */}
                        <GlossyCard glowColor="purple" className="p-4 min-h-[220px] flex flex-col relative overflow-hidden">
                          <div className="absolute top-2 right-2 font-mono text-[8px] border border-white/10 bg-black/50 px-2 py-0.5">// GRAPH_LINKER</div>
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-[#8B5CF6] mb-1">
                            VAYU Relational Correlation Graph™
                          </h4>
                          <p className="text-[9.5px] font-mono text-white/40 mb-3">Interactive relationship nodes. Drag or click keys to focus:</p>
                          
                          <div className="flex-1 bg-black/60 border border-white/5 relative rounded min-h-[140px]">
                            <canvas 
                              ref={graphCanvasRef} 
                              width={400} 
                              height={160} 
                              className="w-full h-full block cursor-crosshair"
                            />
                          </div>
                        </GlossyCard>

                        {/* WIDGET B: LIVE GEOLOCATION RADAR CAN */}
                        <GlossyCard glowColor="cyan" className="p-4 min-h-[220px] flex flex-col relative overflow-hidden">
                          <div className="absolute top-2 right-2 font-mono text-[8px] border border-white/10 bg-black/50 px-2 py-0.5">// RADAR_STATION</div>
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-[#00E5FF] mb-1">
                            Internet Active Geolocation Spotter™
                          </h4>
                          <p className="text-[9.5px] font-mono text-white/40 mb-3">Live ping coordinates mapped continuously on sweep intervals:</p>
                          
                          <div className="flex-1 bg-black/60 border border-white/5 relative rounded min-h-[140px]">
                            <canvas 
                              ref={radarCanvasRef} 
                              width={400} 
                              height={160} 
                              className="w-full h-full block"
                            />
                          </div>
                        </GlossyCard>

                      </div>

                      {/* INTERACTIVE THREAT INDICATORS FILTER LIST */}
                      <GlossyCard glowColor="cyan" className="p-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#00E5FF]">Threat Hunt Register Workspace</h4>
                          <span className="text-[9.5px] font-mono text-white/40">{filteredHuntIndicators.length} records matching boundaries</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full font-mono text-[10px]">
                            <thead>
                              <tr className="bg-white/5 border-b border-white/10 text-white/40 text-left">
                                <th className="p-2">INDICATOR VALUE</th>
                                <th className="p-2">TYPE</th>
                                <th className="p-2">RISK SCORE</th>
                                <th className="p-2">GEOGRAPHIC INFO</th>
                                <th className="p-2 text-right">OPERATIONS</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 select-text">
                              {filteredHuntIndicators.map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="p-2 font-bold text-white">{item.value}</td>
                                  <td className="p-2 text-white/60">{item.type}</td>
                                  <td className="p-2 font-bold">
                                    <span className={item.risk >= 80 ? 'text-[#FF3D71]' : item.risk >= 40 ? 'text-[#8B5CF6]' : 'text-[#00D97E]'}>
                                      {item.risk}/100
                                    </span>
                                  </td>
                                  <td className="p-2 text-white/60">{item.geo}</td>
                                  <td className="p-2 text-right">
                                    <button 
                                      onClick={() => triggerSearchQuery(item.value)}
                                      className="bg-white/5 hover:bg-[#00E5FF]/20 border border-white/10 text-xs px-2 py-0.5 text-white transition-all rounded-sm font-mono"
                                    >
                                      SWEEP PIN
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {filteredHuntIndicators.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="p-4 text-center text-white/30 italic">No nodes matching applied filter matrices.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </GlossyCard>

                    </section>
                  </>
                )}

                {/* TAB CHASSIS 2 (SPECIALIZED: LIVE ATTACK SURFACE AUDIO / EXPOSURE AUDIT) */}
                {resultsTab === 'attack-surface' && (
                  <section className="col-span-12 flex flex-col gap-4" id="asm-exposure-workspace">
                    
                    {/* TOP ASM SUMMARY BAR WIDGETS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      {/* SUB WIDGET A: AUDIT SCORE */}
                      <div className="bg-black/50 backdrop-blur-md border border-[#FF3D71]/30 p-5 rounded-sm relative overflow-hidden select-text">
                        <span className="text-[8px] font-mono text-white/40 block uppercase tracking-wider mb-1">// ASSET POSTURE</span>
                        <div className="flex items-center justify-between">
                          <h4 className="text-3xl font-black text-white leading-none">
                            {profile.exposureScore}/100
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#FF3D71]/10 text-[#FF3D71] border border-[#FF3D71]/20 font-black">
                            {profile.exposureScore >= 70 ? 'CRITICAL EXPOSURE' : profile.exposureScore >= 40 ? 'MEDIUM WEAKNESS' : 'SECURE CONFIG'}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-white/60 mt-3 leading-relaxed">
                          Elevated score confirms public discovery points reachable by non-friendly sweeps.
                        </p>
                      </div>

                      {/* SUB WIDGET B: CERT EXPIRY */}
                      <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm select-text">
                        <span className="text-[8px] font-mono text-white/40 block uppercase tracking-wider mb-1">// Certificate State</span>
                        <h4 className="text-sm font-black text-white uppercase leading-none mt-1">
                          {profile.certAge || 'UNSPECIFIED TLS CERTIFICATE'}
                        </h4>
                        <div className="text-[10px] font-mono text-white/50 mt-4">
                          TLS Trust Seal: <strong className="text-[#00D97E]">Valid Authority</strong>
                        </div>
                      </div>

                      {/* SUB WIDGET C: OPEN SERVICES COUNTS */}
                      <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm select-text">
                        <span className="text-[8px] font-mono text-white/40 block uppercase tracking-wider mb-1">// Exposed Service Ports</span>
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-3xl font-black text-[#00E5FF] leading-none">
                            {profile.openPorts?.length || 0}
                          </h4>
                          <span className="text-[10px] font-mono text-white/40">Active Listening Ports</span>
                        </div>
                        <div className="text-[10px] font-mono text-white/50 mt-3 leading-relaxed">
                          Public network tunnels responding with explicit banners.
                        </div>
                      </div>

                      {/* SUB WIDGET D: ZONE ENTRIES */}
                      <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm select-text">
                        <span className="text-[8px] font-mono text-white/40 block uppercase tracking-wider mb-1">// Registered DNS Resources</span>
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-3xl font-black text-[#8B5CF6] leading-none">
                            {profile.dnsRecords?.length || 0}
                          </h4>
                          <span className="text-[10px] font-mono text-white/40">Zonal Records</span>
                        </div>
                        <div className="text-[10px] font-mono text-white/50 mt-3">
                          Total published CNAME / MX routes.
                        </div>
                      </div>

                    </div>

                    {/* CORE EXPOSURE MAP GRID DETAILS */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* DIRECT PORT MATRIX & BANNERS INSPECTOR (COL RANGE: 5) */}
                      <div className="lg:col-span-5 flex flex-col gap-4">
                        
                        {/* PORT MATRIX STATUS VISUALIZER */}
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#FF3D71] pb-2 border-b border-white/10 mb-4 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            Exposed Port Matrix Indicator
                          </h4>
                          <p className="text-[9.5px] font-mono text-white/40 mb-3">Compliance scanning sweeps standard cloud ingress points. Red ports are open:</p>
                          
                          {/* Port Dot Grid */}
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                            {[20, 21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 1194, 1433, 3306, 3389, 5000, 8080, 9000].map(portNum => {
                              const isOpen = profile.openPorts?.includes(portNum);
                              return (
                                <div 
                                  key={portNum} 
                                  className={`p-2 border font-mono text-center transition-all ${
                                    isOpen 
                                      ? 'bg-[#FF3D71]/15 border-[#FF3D71] text-white shadow-[0_0_8px_rgba(255,61,113,0.15)]' 
                                      : 'bg-black/40 border-white/5 text-white/30'
                                  }`}
                                  title={`Port ${portNum}: ${isOpen ? 'EXPOSED ON PUBLIC IP' : 'CLOSED / PROTECTED WAF'}`}
                                >
                                  <div className="text-[10.5px] font-bold">{portNum}</div>
                                  <div className="text-[7.5px] font-sans opacity-60 uppercase">{isOpen ? 'OPEN' : 'SECURE'}</div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-white/5 p-2 border border-white/10 text-[9px] font-mono text-white/50 uppercase rounded-sm flex justify-between items-center">
                            <span>RECON SCHEME: NMAP SWEET</span>
                            <span className="text-[#00D97E]">COMPLIANT SCAN</span>
                          </div>
                        </div>

                        {/* RAW HTTP / SERVICE BANNER RESPONSE */}
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm select-text">
                          <h4 className="text-xs font-black uppercase tracking-widest text-white/80 pb-2 border-b border-white/10 mb-3 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
                            Ingested Service Banners
                          </h4>
                          <p className="text-[9.5px] font-mono text-white/40 mb-3">Exposed protocol banners matching system handshakes:</p>
                          
                          <div className="space-y-2 max-h-[160px] overflow-y-auto">
                            {profile.banners && profile.banners.map((banner, idx) => (
                              <div key={idx} className="bg-black border border-white/10 p-2.5 rounded font-mono text-[9.5px] leading-relaxed text-[#00E5FF] overflow-x-auto whitespace-pre">
                                {banner}
                              </div>
                            )) || (
                              <div className="text-xs font-mono text-white/30 text-center py-4 bg-black/40 border border-white/5">
                                No raw banners resolved on current target scope.
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* SUBDMAIN & DNS RECORDS TABLE (COL RANGE: 7) */}
                      <div className="lg:col-span-7 flex flex-col gap-4">
                        
                        {/* THE SUBDOMAINS REGISTRY LIST SCREEN */}
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm select-text">
                          <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" />
                              Subdomain exposure Inventory Layout
                            </h4>
                            <span className="text-[10px] font-mono bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/20 px-2 py-0.5 uppercase">
                              {profile.subdomains?.length || 0} Targets Found
                            </span>
                          </div>

                          <p className="text-[9.5px] font-mono text-white/40 mb-3">
                            Auto discovered internal subdomain registries exposed publicly via zone transfers or transparency logs:
                          </p>

                          <div className="overflow-y-auto space-y-1.5 pr-1" style={{ maxHeight: '180px' }}>
                            {profile.subdomains && profile.subdomains.map((sub, idx) => (
                              <div key={idx} className="bg-white/[0.02] border border-white/5 p-2 flex items-center justify-between text-[11px] font-mono hover:bg-[#FF3D71]/5 transition-all">
                                <span className="font-bold text-white truncate">{sub}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] px-1 bg-red-500/10 text-red-400 border border-red-500/20 font-bold">REACHABLE</span>
                                  <button 
                                    onClick={() => triggerSearchQuery(sub)}
                                    className="bg-zinc-800 hover:bg-[#00E5FF] hover:text-black hover:border-[#00E5FF] px-1.5 py-0.5 border border-white/10 text-[8px] transition-colors uppercase rounded-xs"
                                  >
                                    Scan Host
                                  </button>
                                </div>
                              </div>
                            )) || (
                              <div className="text-xs font-mono text-white/30 text-center py-6 bg-black/45 border border-white/5">
                                No public subdomains registered.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* DNS RESOURCE ZONES INDEX */}
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm select-text">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#8B5CF6] pb-2 border-b border-white/10 mb-3 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Resolved DNS resource zones record matrix
                          </h4>
                          <p className="text-[9.5px] font-mono text-white/40 mb-3">Configured authoritative nameserver entries resolver output:</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                            {profile.dnsRecords && profile.dnsRecords.map((dnsRec, idx) => (
                              <div key={idx} className="bg-white/[0.01] border border-white/5 p-2 flex items-center gap-3">
                                <span className="text-[#00E5FF] font-black tracking-widest bg-[#00E5FF]/10 py-1 px-1.5 text-center min-w-[32px] border border-[#00E5FF]/10">{dnsRec.type}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white/40 text-[8px] truncate leading-tight uppercase">{dnsRec.name}</p>
                                  <p className="text-white leading-tight font-bold truncate">{dnsRec.value}</p>
                                </div>
                              </div>
                            )) || (
                              <div className="col-span-2 text-xs font-mono text-white/30 text-center py-6">
                                DNS verification records unmapped.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* TECHNOLOGY EXPOSURE INDEX CHIPS */}
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-sm select-text">
                          <h4 className="text-xs font-black uppercase tracking-widest text-white/80 mb-2">// Tech Stack Exposure Metrics</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.techStack && profile.techStack.map((tech, i) => (
                              <span key={i} className="bg-white/5 border border-white/10 px-2 py-1 text-xs font-mono text-white/70">
                                {tech}
                              </span>
                            )) || <span className="text-xs font-mono text-white/30">None Identified</span>}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* INTERACTIVE HISTORICAL TIMELINE */}
                    <div className="bg-[#030712]/60 border border-white/10 p-5 rounded-sm">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#00E5FF] pb-2 border-b border-white/10 mb-4 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Interactive IOC Activity Timeline
                      </h4>
                      <p className="text-[9.5px] font-mono text-white/40 mb-4 font-bold uppercase">// CHRONICLE STREAM FOR INDICES:</p>
                      
                      <div className="space-y-4 relative border-l border-white/10 ml-3 pl-5 py-2">
                        {profile.timeline.map((evt, i) => {
                          const stateCol = 
                            evt.status === 'critical' ? 'bg-[#FF3D71] shadow-[0_0_10px_#FF3D71]' :
                            evt.status === 'warning' ? 'bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]' :
                            evt.status === 'success' ? 'bg-[#00D97E] shadow-[0_0_10px_#00D97E]' :
                            'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]';
                          return (
                            <div key={i} className="relative font-mono text-xs select-text">
                              <span className={`absolute -left-[25.5px] top-1 w-2.5 h-2.5 rounded-full ${stateCol}`}></span>
                              <div className="flex justify-between text-[10px] text-white/40 mb-1">
                                <span>{evt.date} // TACTICAL_MARKER</span>
                                <span className="uppercase tracking-widest font-bold">{evt.status}</span>
                              </div>
                              <p className="text-white text-xs leading-relaxed font-sans">{evt.event}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </section>
                )}
                              {/* TAB CHASSIS 3 (VAYU THREAT ADVISOR BOARD) */}
                {resultsTab === 'threat-analyst' && (
                  <>
                    {/* LEFT COLUMN: TELEMETRY & OS PROBES (COL RANGE: 4) */}
                    <aside className="lg:col-span-4 flex flex-col gap-4">
                      
                      {/* BAR GRAPH GRAPHIC */}
                      <div className="bg-black/60 border border-[#00E5FF]/20 p-5 backdrop-blur-md flex flex-col justify-between select-text rounded-sm">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5 mb-2 pb-2 border-b border-white/10">
                            <Globe2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                            Geographic Dispersal Matrix
                          </h3>
                          <p className="text-[9.5px] font-mono text-white/40 mb-4">Ingestion scan indices recorded over standard 24-hour cycle:</p>
                          
                          {/* Visual high contrast bars */}
                          <div className="w-full h-40 bg-gradient-to-t from-[#00E5FF]/5 to-transparent flex items-end gap-1.5 px-2 border-b border-white/10 pb-1">
                            <div className="flex-1 bg-[#00E5FF]/40 h-[22%]" title="CN (China): 22% risk rating"></div>
                            <div className="flex-1 bg-[#00E5FF]/40 h-[60%]" title="US (United States): 60% risk rating"></div>
                            <div className="flex-1 bg-[#00E5FF]/40 h-[40%]" title="NL (Netherlands): 40% risk rating"></div>
                            <div className="flex-1 bg-[#FF3D71] h-[92%] animate-pulse" title="RU (Russia): 92% critical threshold"></div>
                            <div className="flex-1 bg-[#00E5FF]/40 h-[30%]" title="DE (Germany): 30% risk rating"></div>
                            <div className="flex-1 bg-[#00D97E] h-[38%]" title="UA (Ukraine): 38% risk rating"></div>
                            <div className="flex-1 bg-[#8B5CF6] h-[68%]" title="BR (Brazil): 68% risk rating"></div>
                          </div>

                          <div className="mt-2 flex justify-between text-[9px] font-mono text-white/50 px-2 tracking-widest">
                            <span>CN</span>
                            <span>US</span>
                            <span>NL</span>
                            <span className="text-[#FF3D71] font-bold">RU</span>
                            <span>DE</span>
                            <span>UA</span>
                            <span>BR</span>
                          </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 p-3 mt-6">
                          <span className="text-[9px] font-mono text-white/30 block mb-1">PROVENANCE EVALUATION:</span>
                          <p className="text-[10px] font-mono leading-relaxed text-white/70">
                            Telemetry corroborates exfiltration tunnels aiming mostly towards deep bulletproof infrastructure located in target RU networks.
                          </p>
                        </div>
                      </div>

                      {/* BROWSER DEVICE DIAGNOSTICS PROBE */}
                      <div className="bg-black/60 border border-[#8B5CF6]/20 p-5 backdrop-blur-md flex flex-col justify-between select-text rounded-sm">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-1.5 mb-2 pb-2 border-b border-white/10">
                            <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            Operator Device Recon Probe
                          </h3>
                          <p className="text-[9.5px] font-mono text-white/40 mb-4">Real-time telemetry gathered directly from your local browser context:</p>
                          
                          {deviceInfo ? (
                            <div className="space-y-2 text-[10px] font-mono">
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">OPERATING PLATFORM:</span>
                                <span className="text-white truncate max-w-[140px] text-right" title={deviceInfo.platform}>{deviceInfo.platform}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">SCREEN RESOLUTION:</span>
                                <span className="text-white">{deviceInfo.screenResolution}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">VIEWPORT GRID:</span>
                                <span className="text-[#00E5FF]">{deviceInfo.viewportSize}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">ESTIMATED RAM:</span>
                                <span className="text-white">{deviceInfo.deviceMemory}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">CPU LOGICAL THREADS:</span>
                                <span className="text-white">{deviceInfo.cpuThreads}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">WEB CRYPTO API:</span>
                                <span className="text-[#00D97E]">{deviceInfo.cryptoSupported}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">SPEECH SYNTHESIS:</span>
                                <span className="text-[#00D97E]">{deviceInfo.speechSupported}</span>
                              </div>
                              {deviceInfo.connectionType !== "Not available" && (
                                <>
                                  <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-white/40">CONN SPEED CLASS:</span>
                                    <span className="text-white uppercase">{deviceInfo.connectionType}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-white/40">CONN SPEED DOWNLINK:</span>
                                    <span className="text-white">{deviceInfo.downlink}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-white/40">ESTIMATED RTT:</span>
                                    <span className="text-white">{deviceInfo.rtt}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs font-mono text-white/30 text-center py-4">Probing browser capabilities...</div>
                          )}
                        </div>
                        <div className="text-[8.5px] font-mono text-white/30 mt-4 border-t border-white/5 pt-2 uppercase">
                          * Zero external data leaks. Diagnostics are computed 100% locally.
                        </div>
                      </div>

                    </aside>

                    {/* RIGHT COLUMN: TERMINAL WORKSPACE (COL RANGE: 8) */}
                    <section className="lg:col-span-8 bg-black/60 border border-[#00E5FF]/20 p-5 backdrop-blur-md flex flex-col min-h-[460px] rounded-sm">
                      
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-4">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-[#8B5CF6]" />
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#8B5CF6]">
                            VAYU Threat Advisor Console™
                          </h3>
                        </div>
                        <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-wider font-bold">Heuristic Expert Suite v4.5 // OFFLINE READY</span>
                      </div>

                      {/* SUB MODE TABS inside terminal */}
                      <div className="flex border-b border-white/15 mb-4 text-[11px] font-mono">
                        <button 
                          onClick={() => setAdvisoryTab('briefing')}
                          className={`px-4 py-2 border-b-2 font-bold transition-all ${
                            advisoryTab === 'briefing' ? 'border-[#00E5FF] text-[#00E5FF] bg-white/5' : 'border-transparent text-white/40 hover:text-white/70'
                          }`}
                        >
                          // TACTICAL BRIEFING
                        </button>
                        <button 
                          onClick={() => setAdvisoryTab('crypto')}
                          className={`px-4 py-2 border-b-2 font-bold transition-all ${
                            advisoryTab === 'crypto' ? 'border-[#8B5CF6] text-[#8B5CF6] bg-white/5' : 'border-transparent text-white/40 hover:text-white/70'
                          }`}
                        >
                          // CRYPTOGRAPHIC PARITY SIGNATURE
                        </button>
                      </div>

                      {/* SUB TAB CONTENT 1: TACTICAL BRIEFING WITH SPEECH SYNTHESIS */}
                      {advisoryTab === 'briefing' && (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 text-xs font-mono select-text">
                            
                            {/* Briefing Heading Block */}
                            <div className="bg-[#FF3D71]/5 border border-[#FF3D71]/20 p-4 rounded-sm">
                              <span className="text-[8px] text-[#FF3D71] font-black uppercase tracking-widest block mb-1">
                                // TOP SECRET // INTEL ASSIGNED TO OPERATOR_1
                              </span>
                              <h4 className="text-sm font-bold text-white mb-2 uppercase">
                                INTEL BRIEFING FOR TARGET {profile.query}
                              </h4>
                              <p className="text-white/80 leading-relaxed text-xs">
                                Threat profiling maps this host to the <span className="text-[#FF3D71] font-bold">{profile.verdict}</span> classification index with an overall risk quotient of <span className="text-[#FF3D71] font-bold">{profile.riskScore}/100</span>.
                              </p>
                            </div>

                            {/* Geopolitical Assessment details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white/[0.02] border border-white/10 p-3">
                                <span className="text-[9px] text-[#00E5FF] font-bold uppercase tracking-wider block mb-1">NETWORK RESIDENCE</span>
                                <p className="text-white/70">Operator ASN: <strong className="text-white">{profile.asn}</strong></p>
                                <p className="text-white/70">Host Name: <strong className="text-white">{profile.provider}</strong></p>
                                <p className="text-white/70">Origin: <strong className="text-white">{profile.country} ({profile.countryCode})</strong></p>
                              </div>
                              <div className="bg-white/[0.02] border border-white/10 p-3">
                                <span className="text-[9px] text-[#8B5CF6] font-bold uppercase tracking-wider block mb-1">EXPOSURE INVENTORY</span>
                                <p className="text-white/70">Active Listening Sockets: <strong className="text-white">{profile.openPorts?.join(", ") || 'None active'}</strong></p>
                                <p className="text-white/70">Active Subdomains: <strong className="text-white">{profile.subdomains?.length || 0} discovered</strong></p>
                                <p className="text-white/70">Identified Software: <strong className="text-white">{profile.techStack?.slice(0,2).join(", ") || 'Proprietary'}</strong></p>
                              </div>
                            </div>

                            {/* Summary Text block */}
                            <div className="bg-white/[0.01] border-l-2 border-[#00E5FF] p-3 text-white/90 leading-relaxed font-sans text-xs">
                              {profile.summary}
                            </div>

                            {/* Remediations instructions */}
                            <div className="space-y-2">
                              <span className="text-[9px] text-[#00D97E] font-black uppercase tracking-wider block">RECOMMENDED REMEDIATIONS</span>
                              <div className="space-y-1.5 text-[11px] font-mono">
                                <div className="bg-white/5 border border-white/5 p-2 flex gap-3">
                                  <span className="text-[#00D97E] font-bold">01</span>
                                  <p className="text-white/85">Deploy instant edge filter blocks inside network firewalls to drop all incoming subnet traffic matching IP range of <strong className="text-white">{profile.query}</strong>.</p>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-2 flex gap-3">
                                  <span className="text-[#00D97E] font-bold">02</span>
                                  <p className="text-white/85">Configure DNS Sinkholing matrices over recursive naming endpoints directing queries to subdomains like <strong className="text-white">{profile.subdomains?.[0] || 'parent zones'}</strong> into localhost loopback vectors (127.0.0.1).</p>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* SPEECH SYNTHESIS AUDIO READING CONTROL DECK */}
                          <div className="mt-6 pt-4 border-t border-white/10 bg-white/[0.02] p-4 rounded-sm border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <span className="text-[9px] font-bold text-[#8B5CF6] uppercase block mb-1">
                                🔊 Browser Text-To-Speech Synthesis Core
                              </span>
                              <p className="text-[10px] font-mono text-white/50">
                                Read the tactical briefing text aloud using your device's native browser speech audio pipeline.
                              </p>
                              
                              {/* Sliders layout */}
                              <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40">
                                  <span>SPEED:</span>
                                  <input 
                                    type="range" 
                                    min="0.5" 
                                    max="2" 
                                    step="0.1" 
                                    value={voiceSpeed}
                                    onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                                    className="w-16 accent-[#8B5CF6]"
                                  />
                                  <span className="text-white">{voiceSpeed}x</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40">
                                  <span>PITCH:</span>
                                  <input 
                                    type="range" 
                                    min="0.5" 
                                    max="2" 
                                    step="0.1" 
                                    value={voicePitch}
                                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                                    className="w-16 accent-[#8B5CF6]"
                                  />
                                  <span className="text-white">{voicePitch}</span>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={speakBriefing}
                              className={`px-5 py-3 font-mono font-bold text-xs flex items-center gap-2 border transition-all shrink-0 rounded-sm ${
                                isSpeaking 
                                  ? 'bg-[#FF3D71]/25 border-[#FF3D71] text-[#FF3D71] animate-pulse shadow-[0_0_12px_rgba(255,61,113,0.3)]' 
                                  : 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-white hover:bg-[#8B5CF6] hover:text-black hover:border-[#8B5CF6]'
                              }`}
                            >
                              <span>{isSpeaking ? "⏹️ HALT READOUT VOICE" : "🔊 SPEAK ASSESSMENT"}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SUB TAB CONTENT 2: CRYPTOGRAPHIC SIGNATURE & SECURE STORAGE */}
                      {advisoryTab === 'crypto' && (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-4 text-xs font-mono select-text max-h-[300px] overflow-y-auto pr-1">
                            
                            <div className="bg-white/[0.01] border border-white/10 p-4">
                              <span className="text-[9px] text-[#00D97E] font-black uppercase tracking-widest block mb-1">
                                // Web Cryptography API Verification Module
                              </span>
                              <p className="text-white/70 leading-relaxed text-[11px] font-sans">
                                Guarantee absolute integrity for target records. This utility utilizes your browser's cryptographically secure <strong className="text-[#00E5FF]">crypto.subtle</strong> API to compile SHA-256 or SHA-512 hashes. You can inject a custom Salt seed block to bind integrity signatures exclusively.
                              </p>
                            </div>

                            {/* Configuration inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 border border-white/5 p-4 rounded-xs">
                              <div>
                                <label className="block text-[9px] text-white/40 mb-1 uppercase tracking-wider font-bold">Digest Algorithm Matrix:</label>
                                <select 
                                  value={cryptoAlgorithm} 
                                  onChange={(e) => setCryptoAlgorithm(e.target.value as any)}
                                  className="w-full bg-black border border-white/15 p-2 text-white outline-none focus:border-[#8B5CF6] font-bold"
                                >
                                  <option value="SHA-256">SHA-256 (Robust Signature standard)</option>
                                  <option value="SHA-512">SHA-512 (Ultra High Density Encryption)</option>
                                  <option value="SHA-1">SHA-1 (Legacy Integrity Check)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[9px] text-white/40 mb-1 uppercase tracking-wider font-bold">Custom Signature Seed Salt:</label>
                                <input 
                                  type="text" 
                                  value={cryptoSalt} 
                                  onChange={(e) => setCryptoSalt(e.target.value)}
                                  placeholder="Enter secure salt suffix..."
                                  className="w-full bg-black border border-white/15 p-2 text-white outline-none focus:border-[#8B5CF6] font-bold"
                                />
                              </div>
                            </div>

                            {/* Output Signature Display Terminal */}
                            <div className="bg-black border border-[#00E5FF]/20 p-4 rounded-sm font-mono relative overflow-hidden">
                              <div className="absolute top-1 right-2 text-[7px] text-[#00E5FF]/40">// PARITY_SIGN_HEX</div>
                              <span className="text-[8px] text-[#00E5FF] font-black uppercase tracking-wider block mb-1">AUTHENTICATED DIGITAL SIGNATURE Block:</span>
                              
                              {isComputingCrypto ? (
                                <div className="text-[#00E5FF] animate-pulse py-2 font-bold">// COMPUTING WEB CRYPTO HASH SUFFIX...</div>
                              ) : (
                                <p className="text-white text-[11px] break-all bg-white/[0.02] p-2.5 border border-white/5 select-all font-bold">
                                  {cryptoHash || "NO SIGNATURE GENERATED"}
                                </p>
                              )}
                            </div>

                          </div>

                          {/* ACTION BUTTONS FOR DOWNLOAD */}
                          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 justify-end">
                            <button 
                              onClick={() => {
                                if (!cryptoHash) return;
                                navigator.clipboard.writeText(cryptoHash);
                                alert("Cryptographic signature string copied to clipboard.");
                              }}
                              disabled={!cryptoHash}
                              className="bg-zinc-900 hover:bg-[#8B5CF6] hover:text-black border border-[#8B5CF6]/50 p-2 text-[11px] font-mono uppercase font-bold text-white transition-all rounded-xs disabled:opacity-40"
                            >
                              📋 Copy Hash Code
                            </button>
                            <button 
                              onClick={() => {
                                if (!profile) return;
                                const report = {
                                  target: profile.query,
                                  type: profile.type,
                                  verdict: profile.verdict,
                                  score: profile.riskScore,
                                  signedHash: cryptoHash,
                                  signedWith: cryptoAlgorithm,
                                  signedSalt: cryptoSalt,
                                  downloadedAt: new Date().toISOString()
                                };
                                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `vayu-signed-${profile.query.replace(/\./g, '-')}.json`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                              }}
                              className="bg-[#00E5FF]/20 border border-[#00E5FF]/50 hover:bg-[#00E5FF] hover:text-black p-2 text-[11px] font-mono uppercase font-bold text-white transition-all rounded-xs"
                            >
                              📥 Download Signed Report File (.json)
                            </button>
                          </div>
                        </div>
                      )}

                    </section>
                  </>
                )}

                {resultsTab === 'threat-feeds' && (
                  <section className="col-span-12 flex flex-col gap-4">
                    <RssFeedsPanel />
                  </section>
                )}

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center font-mono">
                <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin mb-3" />
                <p className="text-white">SCANNING TARGET ENVELOPE RECORD MATRIX...</p>
              </div>
            )}

          </div>
        )}
          </>
        )}

      </div>

      {/* FOOTER METRICS DATA BAR PANEL */}
      <footer className="min-h-12 md:h-12 border-t border-[#00E5FF]/15 bg-black flex flex-col md:flex-row items-center px-6 justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest gap-2 py-2 shrink-0 select-text">
        <div className="flex items-center gap-2">
          <span>SYS_CORE:</span>
          <span className="text-[#00D97E] font-bold animate-pulse flex items-center gap-1.5 pr-4 border-r border-white/10">
            <CheckCircle className="w-3.5 h-3.5 text-[#00D97E]" />
            ONLINE
          </span>
          <span className="hidden sm:inline">SAT_LINK: UPSTREAM SYNCED</span>
        </div>
        
        <div className="flex gap-4 md:gap-8 flex-wrap items-center justify-center">
          <span>Active IOCs Index: <strong className="text-white">4,210,029</strong></span>
          <span>Global Scanners Ingested: <strong className="text-[#00E5FF]">812,492</strong></span>
          <span>Malware Campaigns: <strong className="text-[#FF3D71]">412</strong></span>
        </div>

        <div>
          <span>ZONE TIME: {systemTime.substring(0, 19).replace('T', ' ')} UTC</span>
        </div>
      </footer>
    </div>
  );
}
