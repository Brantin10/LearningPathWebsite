import { RemoteOKJob } from '../types';

const CACHE_TTL = 5 * 60 * 1000;
let cachedJobs: RemoteOKJob[] = [];
let cacheTimestamp = 0;

async function fetchAllJobs(): Promise<RemoteOKJob[]> {
  const now = Date.now();
  if (cachedJobs.length > 0 && now - cacheTimestamp < CACHE_TTL) {
    return cachedJobs;
  }

  const res = await fetch('/api/jobs');
  if (!res.ok) throw new Error(`Job search API error: ${res.status}`);

  const jobs: RemoteOKJob[] = await res.json();
  cachedJobs = jobs;
  cacheTimestamp = now;
  return jobs;
}

export async function searchJobs(keyword: string): Promise<RemoteOKJob[]> {
  const allJobs = await fetchAllJobs();
  if (!keyword.trim()) return allJobs.slice(0, 50);

  const terms = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = allJobs.filter((job) => {
    const searchText = `${job.position} ${job.company} ${job.tags.join(' ')}`.toLowerCase();
    return terms.every((term) => searchText.includes(term));
  });

  return filtered.slice(0, 50);
}

export function formatSalary(min: number, max: number): string {
  if (!min && !max) return '';
  const fmt = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

export function timeAgo(epoch: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - epoch;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}
