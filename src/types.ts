export type ThreatVerdict = 'MALICIOUS' | 'SUSPICIOUS' | 'UNKNOWN' | 'BENIGN';

export interface DNSRecord {
  type: string;
  name: string;
  value: string;
}

export interface ThreatDNAPoint {
  category: string;
  score: number; // 0-100 indicating elevated indicator
  description: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'IP' | 'DOMAIN' | 'ASN' | 'MALWARE' | 'CAMPAIGN' | 'CVE' | 'URL' | 'COUNTRY' | 'TECH' | 'ORG' | 'TAG';
  risk?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  status: 'critical' | 'warning' | 'info' | 'success';
}

export interface IntelProfile {
  query: string;
  type: 'IP' | 'DOMAIN' | 'ASN' | 'MALWARE' | 'CAMPAIGN' | 'CVE' | 'URL' | 'TAG';
  riskScore: number; // 0-100
  verdict: ThreatVerdict;
  country: string;
  countryCode: string; // e.g. "RU", "US", "CN"
  asn: string; // e.g. "AS12345"
  provider: string; // e.g. "OVH SAS"
  malwareFamily?: string;
  campaign?: string;
  urlsCount: number;
  domainsCount: number;
  firstSeen: string;
  lastSeen: string;
  
  // Attack Surface & ASM details
  exposureScore: number; // 0-100
  openPorts: number[];
  subdomains?: string[];
  dnsRecords?: DNSRecord[];
  certAge?: string;
  techStack?: string[];
  banners?: string[];
  
  // Threat DNA
  threatDna: ThreatDNAPoint[];
  
  // Pivot graph representation
  nodes: GraphNode[];
  links: GraphLink[];
  
  // Historic timeline
  timeline: TimelineEvent[];
  
  summary: string;
}
