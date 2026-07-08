import { IntelProfile, ThreatVerdict, GraphNode, GraphLink, TimelineEvent, ThreatDNAPoint } from './types.js';

// Pre-defined detailed intelligence profiles
export const FEATURED_PROFILES: { [key: string]: IntelProfile } = {
  // 1. Malicious IP - AsyncRAT C2 Host
  "45.83.193.22": {
    query: "45.83.193.22",
    type: "IP",
    riskScore: 94,
    verdict: "MALICIOUS",
    country: "Russian Federation",
    countryCode: "RU",
    asn: "AS136787",
    provider: "VaporHost LLC",
    malwareFamily: "AsyncRAT",
    campaign: "Stealer-X",
    urlsCount: 24,
    domainsCount: 9,
    firstSeen: "2026-03-12T14:22:00Z",
    lastSeen: "2026-06-10T02:11:00Z",
    exposureScore: 88,
    openPorts: [80, 443, 22, 6006, 7001],
    subdomains: ["c2-master.stealer-x.su", "payload-delivery.stealer-x.su"],
    certAge: "12 days (Expires in 78 days)",
    techStack: ["Nginx", "Docker", "Node.js", "Debian"],
    banners: ["SSH-2.0-OpenSSH_9.2p1 Debian-2+deb12u2", "HTTP/1.1 404 Not Found (nginx)"],
    dnsRecords: [
      { type: "A", name: "c2-master.stealer-x.su", value: "45.83.193.22" },
      { type: "TXT", name: "stealer-x.su", value: "v=spf1 ip4:45.83.193.22 -all" }
    ],
    threatDna: [
      { category: "Infrastructure", score: 92, description: "Host running rogue SSH services on non-standard ports." },
      { category: "Behavior", score: 96, description: "Consistent telemetry exhibiting AsyncRAT Trojan TCP heartbeats." },
      { category: "Malware Linking", score: 95, description: "Strong cryptographic payloads matching standard AsyncRAT C2 configurations." },
      { category: "Campaign Tie", score: 90, description: "Integrated actively in Stealer-X payload distribution workflows." },
      { category: "Exposure Level", score: 85, description: "High internet exposure with multiple open interactive staging shells." },
      { category: "Country Base Risk", score: 80, description: "Located in a region with high geopolitical intelligence concerns." }
    ],
    timeline: [
      { date: "2026-03-12", event: "First observed actively scraping DNS resolvers", status: "info" },
      { date: "2026-04-05", event: "Identified hosting AsyncRAT stage-1 droplet payload", status: "warning" },
      { date: "2026-04-20", event: "URLhaus validates delivery link: test-setup.jar", status: "critical" },
      { date: "2026-05-18", event: "ThreatFox adds indicators matching campaign Stealer-X", status: "critical" },
      { date: "2026-06-02", event: "ASN routes adjusted, BGP prefix hijacking detected", status: "warning" },
      { date: "2026-06-09", event: "Last port scan confirms shell port 7001 is open", status: "critical" }
    ],
    nodes: [
      { id: "45.83.193.22", label: "45.83.193.22", type: "IP", risk: 94 },
      { id: "AS136787", label: "AS136787 (VaporHost)", type: "ASN", risk: 78 },
      { id: "AsyncRAT", label: "AsyncRAT (Trojan)", type: "MALWARE", risk: 95 },
      { id: "Stealer-X", label: "Stealer-X (Campaign)", type: "CAMPAIGN", risk: 90 },
      { id: "RU", label: "Russia (RU)", type: "COUNTRY" },
      { id: "c2-master.stealer-x.su", label: "c2-master.stealer-x.su", type: "DOMAIN", risk: 92 },
      { id: "payload.exe", label: "http://stealer-x.su/payload.exe", type: "URL", risk: 96 }
    ],
    links: [
      { source: "45.83.193.22", target: "AS136787", label: "routes_through" },
      { source: "45.83.193.22", target: "RU", label: "located_in" },
      { source: "45.83.193.22", target: "AsyncRAT", label: "communicates_with" },
      { source: "45.83.193.22", target: "Stealer-X", label: "affiliated_with" },
      { source: "c2-master.stealer-x.su", target: "45.83.193.22", label: "resolves_to" },
      { source: "payload.exe", target: "c2-master.stealer-x.su", label: "hosted_on" }
    ],
    summary: "High-risk node executing active malware control protocols. This IP represents core infrastructure for Campaign Stealer-X. It exhibits persistent TLS handshake signatures matching AsyncRAT server modules."
  },

  // 2. Malicious IP - Lumma Stealer Panel
  "194.26.135.11": {
    query: "194.26.135.11",
    type: "IP",
    riskScore: 98,
    verdict: "MALICIOUS",
    country: "Netherlands",
    countryCode: "NL",
    asn: "AS51765",
    provider: "31173 Services SAS",
    malwareFamily: "Lumma Stealer",
    campaign: "Lumma-Panel-F3",
    urlsCount: 142,
    domainsCount: 18,
    firstSeen: "2026-02-01T09:12:00Z",
    lastSeen: "2026-06-10T04:30:00Z",
    exposureScore: 95,
    openPorts: [80, 443, 8080, 22, 3306],
    subdomains: ["lumma-panel-direct.net", "panel.crypt-stealer.com"],
    certAge: "Expired 2 days ago",
    techStack: ["Nginx", "PHP", "MySQL", "Ubuntu"],
    banners: ["HTTP/1.1 200 OK (nginx/1.24.0)", "MySQL Connection Protocol 10-MariaDB"],
    dnsRecords: [
      { type: "A", name: "lumma-panel-direct.net", value: "194.26.135.11" },
      { type: "NS", name: "lumma-panel-direct.net", value: "ns1.he.net" }
    ],
    threatDna: [
      { category: "Infrastructure", score: 98, description: "Active PHP administrator panel configured for Lumma Stealer builds." },
      { category: "Behavior", score: 99, description: "High volume inbound exfiltration traffic over TCP 8080 from global endpoints." },
      { category: "Malware Linking", score: 98, description: "Payload matches Lumma Stealer C2 exfiltration schema exact structure." },
      { category: "Campaign Tie", score: 95, description: "Associated closely with the active Lumma-Panel-F3 campaign activity." },
      { category: "Exposure Level", score: 90, description: "Exposes open database credentials on standard port 3306 configuration." },
      { category: "Country Base Risk", score: 40, description: "Housed in Western Europe, signaling a compromised or bulletproof VPS proxy." }
    ],
    timeline: [
      { date: "2026-02-01", event: "Subnet registered under bulletproof VPS provider", status: "info" },
      { date: "2026-03-05", event: "Lumma exfiltration pattern identified by sandboxed telemetry", status: "warning" },
      { date: "2026-04-12", event: "URLhaus tags 12 core exfiltration URLs hosting .scr executables", status: "critical" },
      { date: "2026-05-24", event: "Let's Encrypt SSL certificate is suspended due to fraud reports", status: "warning" },
      { date: "2026-06-10", event: "Live feed shows 1.2 GB of raw binary exfil landing in the last hour", status: "critical" }
    ],
    nodes: [
      { id: "194.26.135.11", label: "194.26.135.11", type: "IP", risk: 98 },
      { id: "AS51765", label: "AS51765 (31173 SAS)", type: "ASN", risk: 84 },
      { id: "Lumma Stealer", label: "Lumma Stealer", type: "MALWARE", risk: 98 },
      { id: "Lumma-Panel-F3", label: "Lumma-Panel-F3", type: "CAMPAIGN", risk: 95 },
      { id: "NL", label: "Netherlands (NL)", type: "COUNTRY" },
      { id: "crypt-stealer.com", label: "crypt-stealer.com", type: "DOMAIN", risk: 94 }
    ],
    links: [
      { source: "194.26.135.11", target: "AS51765", label: "routes_through" },
      { source: "194.26.135.11", target: "NL", label: "located_in" },
      { source: "194.26.135.11", target: "Lumma Stealer", label: "servers_as_c2" },
      { source: "194.26.135.11", target: "Lumma-Panel-F3", label: "acts_as_hub" },
      { source: "crypt-stealer.com", target: "194.26.135.11", label: "resolves_to" }
    ],
    summary: "Critical Lumma Stealer exfiltration staging node. Active data interception is underway. Recommend instant border router blocking and blacklisting of associated subnets."
  },

  // 3. Demanded Demo Safe Target - company.com (ASM Simulation)
  "company.com": {
    query: "company.com",
    type: "DOMAIN",
    riskScore: 32,
    verdict: "SUSPICIOUS",
    country: "United States",
    countryCode: "US",
    asn: "AS15169",
    provider: "Google Cloud Platform",
    urlsCount: 0,
    domainsCount: 5,
    firstSeen: "2010-05-10T00:00:00Z",
    lastSeen: "2026-06-10T05:00:00Z",
    exposureScore: 58,
    openPorts: [80, 443, 22, 25, 8080],
    subdomains: [
      "vpn.company.com",
      "mail.company.com",
      "staging.company.com",
      "gitlab.company.com",
      "dev.company.com"
    ],
    certAge: "Valid for 142 days",
    techStack: ["React", "Express.js", "Cloudflare", "Nginx", "Amazon AWS", "Postfix"],
    banners: ["HTTP/1.1 200 OK (Cloudflare-nginx)", "SMTP 2.0 Postfix"],
    dnsRecords: [
      { type: "A", name: "company.com", value: "34.120.45.18" },
      { type: "MX", name: "company.com", value: "10 mail.company.com" },
      { type: "TXT", name: "company.com", value: "v=spf1 include:_spf.google.com ~all" },
      { type: "NS", name: "company.com", value: "ns1.dns.cloudflare.com" }
    ],
    threatDna: [
      { category: "Infrastructure", score: 25, description: "Core domain hosted on stable enterprise cloud space." },
      { category: "Behavior", score: 18, description: "No abnormal exfiltration or darknet queries detected." },
      { category: "Malware Linking", score: 5, description: "Zero malware associations index registered in CTI." },
      { category: "Campaign Tie", score: 2, description: "No targeting campaign indicator identified." },
      { category: "Exposure Level", score: 65, description: "Exposes pre-production subdomains (staging, dev) publicly." },
      { category: "Country Base Risk", score: 12, description: "Low risk US jurisdiction core datacenter routing." }
    ],
    timeline: [
      { date: "2010-05-10", event: "Initial registrar creation and root zone updates", status: "success" },
      { date: "2025-11-20", event: "Migrated infrastructure backend to Cloudflare proxy system", status: "success" },
      { date: "2026-05-14", event: "Gitlab pre-production sub-route identified by crawler scans", status: "warning" },
      { date: "2026-06-05", event: "SSL certificate automatically rotated successfully", status: "success" },
      { date: "2026-06-10", event: "VAYU audit exposes unpatched staging Express server vulnerabilities", status: "warning" }
    ],
    nodes: [
      { id: "company.com", label: "company.com", type: "DOMAIN", risk: 32 },
      { id: "34.120.45.18", label: "34.120.45.18 (GCP)", type: "IP", risk: 15 },
      { id: "AS15169", label: "AS15169 (Google)", type: "ASN", risk: 10 },
      { id: "staging.company.com", label: "staging.company.com", type: "DOMAIN", risk: 48 },
      { id: "gitlab.company.com", label: "gitlab.company.com", type: "DOMAIN", risk: 52 },
      { id: "US", label: "United States (US)", type: "COUNTRY" }
    ],
    links: [
      { source: "company.com", target: "34.120.45.18", label: "resolves_to" },
      { source: "34.120.45.18", target: "AS15169", label: "routes_through" },
      { source: "34.120.45.18", target: "US", label: "located_in" },
      { source: "staging.company.com", target: "company.com", label: "parent_zone" },
      { source: "gitlab.company.com", target: "company.com", label: "parent_zone" }
    ],
    summary: "Attack surface exhibits moderate vectors. The exposure of pre-production stages ('staging.company.com' and 'gitlab.company.com') publicly without IP whitelisting increases core exposure registers."
  },

  // 4. Featured Malware Profile - AsyncRAT
  "asyncrat": {
    query: "AsyncRAT",
    type: "MALWARE",
    riskScore: 95,
    verdict: "MALICIOUS",
    country: "Multi-Source",
    countryCode: "XS",
    asn: "AS12345",
    provider: "Various",
    urlsCount: 842,
    domainsCount: 142,
    firstSeen: "2019-01-01T00:00:00Z",
    lastSeen: "2026-06-10T05:00:00Z",
    exposureScore: 91,
    openPorts: [6606, 7001, 8808],
    subdomains: ["asyncrat-dns-master.org", "updater-service.su"],
    certAge: "N/A",
    techStack: ["C# .NET Engine", "AES-256 Crypto", "TCP Keepalive Protocol"],
    threatDna: [
      { category: "Infrastructure", score: 95, description: "Highly dispersed dynamic DNS infrastructure endpoints." },
      { category: "Behavior", score: 98, description: "System manipulation, registry injection, credential harvesting keystrikes." },
      { category: "Malware Linking", score: 100, description: "Verified AsyncRAT binary cryptographic headers." },
      { category: "Campaign Tie", score: 85, description: "Leveraged extensively in phish campaigns and loader drop workflows." },
      { category: "Exposure Level", score: 92, description: "Widespread infestation across small business datastaff networks." },
      { category: "Country Base Risk", score: 70, description: "Global dispersal with concentrated command centers in EU and RU subnet registers." }
    ],
    timeline: [
      { date: "2019-01-12", event: "Initial Github repository released under open-source banner", status: "info" },
      { date: "2020-04-18", event: "Observed weaponization with custom crypter engines", status: "warning" },
      { date: "2022-09-02", event: "Major campaign deploying AsyncRAT via infected Excel webqueries", status: "critical" },
      { date: "2025-03-12", event: "Active exploitation index surges in APAC financial target zones", status: "critical" },
      { date: "2026-06-10", event: "Real-time crawler lists 24 new C2 servers online globally", status: "critical" }
    ],
    nodes: [
      { id: "AsyncRAT", label: "AsyncRAT (Trojan)", type: "MALWARE", risk: 95 },
      { id: "Stealer-X", label: "Stealer-X (Campaign)", type: "CAMPAIGN", risk: 90 },
      { id: "45.83.193.22", label: "45.83.193.22", type: "IP", risk: 94 },
      { id: "AS136787", label: "AS136787 (VaporHost)", type: "ASN", risk: 78 },
      { id: "RU", label: "Russia (RU)", type: "COUNTRY" }
    ],
    links: [
      { source: "AsyncRAT", target: "Stealer-X", label: "utilized_by" },
      { source: "45.83.193.22", target: "AsyncRAT", label: "hosts_c2" },
      { source: "45.83.193.22", target: "AS136787", label: "hosted_on" },
      { source: "45.83.193.22", target: "RU", label: "geoloc_at" }
    ],
    summary: "Widespread remote access Trojan (RAT). It leverages secure .NET encryption vectors to evade payload inspection agents, enabling remote operators full administrative interface controls on client victims."
  },

  // 5. Featured CVE Profile - CVE-2024-3094
  "cve-2024-3094": {
    query: "CVE-2024-3094",
    type: "CVE",
    riskScore: 100,
    verdict: "MALICIOUS",
    country: "Global",
    countryCode: "XS",
    asn: "AS0",
    provider: "Open Source Project",
    urlsCount: 22,
    domainsCount: 14,
    firstSeen: "2024-03-29T12:00:00Z",
    lastSeen: "2026-06-10T00:00:00Z",
    exposureScore: 99,
    openPorts: [22],
    certAge: "N/A",
    techStack: ["SSH", "XZ Utils", "Liblzma", "Debian Linux", "RedHat Linux"],
    threatDna: [
      { category: "Infrastructure", score: 98, description: "Injects malicious logic inside critical SSH compilation assets." },
      { category: "Behavior", score: 100, description: "Permits remote pre-authentication trigger code injection bypassing PAM authentication." },
      { category: "Malware Linking", score: 95, description: "Highly calculated stealth backdoor payload with multi-stage triggers." },
      { category: "Campaign Tie", score: 80, description: "Strategic upstream supply chain contamination targeting cloud infrastructure." },
      { category: "Exposure Level", score: 99, description: "Ubiquitous use of SSH in servers presents extreme risk vectors." },
      { category: "Country Base Risk", score: 50, description: "Global deployment of compromised Linux utility containers." }
    ],
    timeline: [
      { date: "2024-02-15", event: "Backdoored release tags pushed into upstream XZ Git releases", status: "warning" },
      { date: "2024-03-29", event: "Andres Freund discloses critical SSH performance lag leading to backdoor discovery", status: "critical" },
      { date: "2024-03-30", event: "Urgent enterprise mitigation and downgrade guides released worldwide", status: "critical" },
      { date: "2026-06-10", event: "VAYU audit checks confirm 12 legacy legacy containers still active with backdoor indicators", status: "warning" }
    ],
    nodes: [
      { id: "CVE-2024-3094", label: "CVE-2024-3094 (XZ Backdoor)", type: "CVE", risk: 100 },
      { id: "SSH", label: "SSH Daemon", type: "TECH" },
      { id: "JiaTan", label: "Sleeper Actor: Jia Tan", type: "MALWARE", risk: 99 },
      { id: "XZ Utils", label: "XZ Utils 5.6.0", type: "TECH" }
    ],
    links: [
      { source: "CVE-2024-3094", target: "SSH", label: "exploits_services" },
      { source: "CVE-2024-3094", target: "JiaTan", label: "introduced_by" },
      { source: "CVE-2024-3094", target: "XZ Utils", label: "targets_package" }
    ],
    summary: "One of the most dangerous software supply-chain backdoor actions history. Compromised liblzma libraries intercept sshd authentication processes, allowing unauthorized remote threat access with administrative rights."
  }
};

// Simple helper to detect query types
export function detectQueryType(query: string): 'IP' | 'DOMAIN' | 'ASN' | 'MALWARE' | 'CAMPAIGN' | 'CVE' | 'URL' | 'TAG' {
  const clean = query.trim().toLowerCase();
  
  if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(clean)) {
    return 'IP';
  }
  if (/^as\d+$/i.test(clean)) {
    return 'ASN';
  }
  if (/^cve-\d{4}-\d{4,7}$/i.test(clean)) {
    return 'CVE';
  }
  if (/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(clean)) {
    if (clean.includes('/') || clean.includes('?')) {
      return 'URL';
    }
    return 'DOMAIN';
  }
  
  // Tag / Keyword categorizations
  const malwareKeywords = ['rat', 'stealer', 'lumma', 'async', 'redline', 'cobalt', 'agent', 'payload-dropper'];
  if (malwareKeywords.some(kw => clean.includes(kw))) {
    return 'MALWARE';
  }
  
  const campaignKeywords = ['operation', 'stealer-x', 'aurora', 'storm-', 'sandworm', 'fancy', 'apt'];
  if (campaignKeywords.some(kw => clean.includes(kw))) {
    return 'CAMPAIGN';
  }

  // Fallback domain-like
  if (clean.includes('.')) {
    return 'DOMAIN';
  }
  
  return 'TAG';
}

// Generate highly detailed intelligence profile on the fly
export function generateProfileOnTheFly(query: string): IntelProfile {
  const cleanQuery = query.trim();
  const type = detectQueryType(cleanQuery);
  const lowercase = cleanQuery.toLowerCase();
  
  // Build a smart deterministic risk score so it stays consistent on re-searches
  let hash = 0;
  for (let i = 0; i < cleanQuery.length; i++) {
    hash = cleanQuery.charCodeAt(i) + ((hash << 5) - hash);
  }
  const scoreBase = Math.abs(hash);
  const riskScore = type === 'IP' || type === 'URL' || type === 'CVE' 
    ? 50 + (scoreBase % 46)  // 50-95
    : (type === 'DOMAIN' ? 10 + (scoreBase % 81) : 40 + (scoreBase % 55)); // 10-90 or 40-95
    
  let verdict: ThreatVerdict = 'UNKNOWN';
  if (riskScore >= 75) {
    verdict = 'MALICIOUS';
  } else if (riskScore >= 40) {
    verdict = 'SUSPICIOUS';
  } else if (riskScore < 21) {
    verdict = 'BENIGN';
  } else {
    verdict = 'UNKNOWN';
  }
  
  const countries = [
    { name: "United States", code: "US", baseReg: 15 },
    { name: "China", code: "CN", baseReg: 78 },
    { name: "Russia", code: "RU", baseReg: 90 },
    { name: "Germany", code: "DE", baseReg: 18 },
    { name: "Netherlands", code: "NL", baseReg: 30 },
    { name: "Brazil", code: "BR", baseReg: 54 },
    { name: "Ukraine", code: "UA", baseReg: 68 },
    { name: "Romania", code: "RO", baseReg: 72 }
  ];
  const countryObj = countries[scoreBase % countries.length];
  const asnNumber = 1000 + (scoreBase % 90000);
  const providers = ["OVH Cloud", "DigitalOcean LLC", "Hetzner Online", "VaporHost LLC", "Chunghwa Telecom", "China Unicom", "Amazon Server Hosting", "Claro Telecom"];
  const provider = providers[scoreBase % providers.length];
  
  const malwareList = ["RedLine Stealer", "AsyncRAT", "Lumma Stealer", "DarkGate", "Cobalt Strike", "Agent Tesla", "Vidar Malware"];
  const malwareFamily = malwareList[scoreBase % malwareList.length];
  
  const campaignList = ["Stealer-X", "Operation Phoenix", "LuckyMouse", "Storm-0952", "Sandworm Intel Alpha", "RedAlpha Payload Campaign"];
  const campaign = campaignList[scoreBase % campaignList.length];
  
  const techOptions = [
    ["Nginx", "React", "Docker", "Node.js", "Express"],
    ["Apache HTTP Server", "PHP", "MariaDB", "WordPress"],
    ["Cloudflare Proxy", "Next.js", "Amazon S3", "Tailwind CSS"],
    ["Microsoft IIS", "ASP.NET Core", "MSSQL Server", "Windows Server"]
  ];
  const techStack = techOptions[scoreBase % techOptions.length];
  
  const openPortsOptions = [
    [80, 443, 8080],
    [80, 443, 22, 21, 3306],
    [80, 443, 22, 8443, 9000],
    [80, 443, 8888, 3000, 5000]
  ];
  const openPorts = openPortsOptions[scoreBase % openPortsOptions.length];
  
  const dnsRecords = [
    { type: "A", name: cleanQuery, value: `185.${scoreBase % 255}.${(scoreBase >> 8) % 255}.${(scoreBase >> 16) % 255}` },
    { type: "NS", name: cleanQuery, value: "ns1.internetdns-routing.net" },
    { type: "MX", name: cleanQuery, value: "10 mail.interactive-inbox-server.ltd" },
    { type: "TXT", name: cleanQuery, value: `v=spf1 ip4:185.${scoreBase % 255}.0.0/16 include:_spf.google.com ~all` }
  ];

  const subdomains = [
    `vpn.${cleanQuery}`,
    `api.${cleanQuery}`,
    `portal.${cleanQuery}`,
    `dev.${cleanQuery}`,
    `admin.${cleanQuery}`
  ];

  const now = new Date();
  const pastDays = (scoreBase % 60) + 10;
  const firstSeenDate = new Date(now.getTime() - pastDays * 24 * 60 * 60 * 1000);
  const lastSeenDate = new Date(now.getTime() - (scoreBase % 12) * 60 * 60 * 1000);

  const exposureScore = Math.min(100, Math.max(10, riskScore + (scoreBase % 15) - 5));

  const threatDna: ThreatDNAPoint[] = [
    { 
      category: "Infrastructure", 
      score: Math.min(100, Math.max(10, riskScore + (scoreBase % 12) - 6)),
      description: verdict === 'MALICIOUS' ? "Exhibits unstable registry updates and low-reputation staging zones." : "Maintains high certificate trust index." 
    },
    { 
      category: "Behavior", 
      score: Math.min(100, Math.max(10, riskScore + (scoreBase % 16) - 8)),
      description: verdict === 'MALICIOUS' ? "Consistently scans adjacent subnets targeting legacy ports." : "Standard HTTP connection characteristics." 
    },
    { 
      category: "Malware Linking", 
      score: verdict === 'MALICIOUS' ? Math.min(100, Math.max(50, riskScore - 5)) : (verdict === 'SUSPICIOUS' ? 30 : 5), 
      description: verdict === 'MALICIOUS' ? `Payloas tied directly with binary builds matching ${malwareFamily}.` : "No known payload signatures flagged." 
    },
    { 
      category: "Campaign Tie", 
      score: verdict === 'MALICIOUS' ? Math.min(100, Math.max(40, riskScore - 12)) : (verdict === 'SUSPICIOUS' ? 20 : 0), 
      description: verdict === 'MALICIOUS' ? `Observed coordinating as an operations base for ${campaign}.` : "No targeted campaign signals identified." 
    },
    { 
      category: "Exposure Level", 
      score: exposureScore, 
      description: `Active open surface count is ${openPorts.length} with public interactive services.` 
    },
    { 
      category: "Country Base Risk", 
      score: countryObj.baseReg, 
      description: `Located in region registry with a base hazard rating of ${countryObj.baseReg}/100.` 
    }
  ];

  // Make a beautiful graph representation
  const mainNodeId = cleanQuery;
  const nodes: GraphNode[] = [
    { id: mainNodeId, label: cleanQuery, type, risk: riskScore },
    { id: `AS${asnNumber}`, label: `AS${asnNumber} (${provider})`, type: "ASN", risk: Math.min(100, Math.max(10, riskScore - 15)) },
    { id: countryObj.code, label: `${countryObj.name} (${countryObj.code})`, type: "COUNTRY" }
  ];

  const links: GraphLink[] = [
    { source: mainNodeId, target: `AS${asnNumber}`, label: "network_routing" },
    { source: mainNodeId, target: countryObj.code, label: "geopolitical_hosted" }
  ];

  if (verdict === 'MALICIOUS' || verdict === 'SUSPICIOUS') {
    nodes.push({ id: malwareFamily, label: malwareFamily, type: "MALWARE", risk: 85 });
    nodes.push({ id: campaign, label: campaign, type: "CAMPAIGN", risk: 80 });
    
    links.push({ source: mainNodeId, target: malwareFamily, label: "delivers_payload" });
    links.push({ source: mainNodeId, target: campaign, label: "correlated_to" });
  }

  // Create subdomains or associated IPs in the graph for added depth
  const randomIPNode = `103.${scoreBase % 254}.${(scoreBase >> 4) % 254}.${(scoreBase >> 8) % 254}`;
  nodes.push({ id: randomIPNode, label: randomIPNode, type: "IP", risk: Math.max(10, riskScore - 20) });
  links.push({ source: mainNodeId, target: randomIPNode, label: "resolves_alias" });

  const timeline: TimelineEvent[] = [
    { date: firstSeenDate.toISOString().slice(0, 10), event: `Asset recorded initially in routing tables as type: ${type}`, status: "info" },
    { date: new Date(firstSeenDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), event: `VAYU Crawler validates technology stack components: ${techStack.slice(0, 2).join(", ")}`, status: "success" }
  ];

  if (verdict === 'MALICIOUS') {
    timeline.push({ 
      date: new Date(lastSeenDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), 
      event: `Observed exfiltrating data structures to ${randomIPNode}`, 
      status: "critical" 
    });
    timeline.push({ 
      date: new Date(lastSeenDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), 
      event: `Payload signature mismatch flagged as critical hazard: ${malwareFamily}`, 
      status: "critical" 
    });
  } else if (verdict === 'SUSPICIOUS') {
    timeline.push({ 
      date: new Date(lastSeenDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), 
      event: "Port scanner reports vulnerability scanning triggers on port 8080", 
      status: "warning" 
    });
  }

  timeline.push({ 
    date: lastSeenDate.toISOString().slice(0, 10), 
    event: `Telemetry scan completed. Final security status set to ${verdict} (Risk: ${riskScore})`, 
    status: verdict === 'MALICIOUS' ? "critical" : (verdict === 'SUSPICIOUS' ? "warning" : "info") 
  });

  return {
    query: cleanQuery,
    type,
    riskScore,
    verdict,
    country: countryObj.name,
    countryCode: countryObj.code,
    asn: `AS${asnNumber}`,
    provider,
    malwareFamily: verdict === 'MALICIOUS' || verdict === 'SUSPICIOUS' ? malwareFamily : undefined,
    campaign: verdict === 'MALICIOUS' || verdict === 'SUSPICIOUS' ? campaign : undefined,
    urlsCount: verdict === 'MALICIOUS' ? (scoreBase % 100) + 12 : 0,
    domainsCount: verdict === 'MALICIOUS' ? (scoreBase % 8) + 2 : 0,
    firstSeen: firstSeenDate.toISOString(),
    lastSeen: lastSeenDate.toISOString(),
    exposureScore,
    openPorts,
    subdomains,
    certAge: verdict === 'BENIGN' ? "Valid for 340 days" : "Expiring or unverified Let's Encrypt shell",
    techStack,
    banners: openPorts.map(p => `Port ${p} TCP active banner placeholder`),
    dnsRecords,
    threatDna,
    nodes,
    links,
    timeline,
    summary: verdict === 'MALICIOUS' 
      ? `This target represents an active hazard node linked with the ${malwareFamily} deployment matrix running active ports.`
      : (verdict === 'SUSPICIOUS' 
        ? `This target demonstrates suspicious background behavior vectors, including hosting pre-production modules or open SSH services.` 
        : `This asset is stable and exhibits low security alerts. It routes through standard cloud structures with no correlation indices.`)
  };
}

// Global master search function
export function getProfile(query: string): IntelProfile {
  const clean = query.trim();
  
  // 1. Direct match on pre-defined detailed datasets
  if (FEATURED_PROFILES[clean]) {
    return FEATURED_PROFILES[clean];
  }
  
  // Case-insensitive featured matches
  const lowercase = clean.toLowerCase();
  for (const key of Object.keys(FEATURED_PROFILES)) {
    if (key.toLowerCase() === lowercase) {
      return FEATURED_PROFILES[key];
    }
  }
  
  // 2. Otherwise generate a high-fidelity dynamic profile instantly
  return generateProfileOnTheFly(clean);
}
