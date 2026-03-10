// ── Learning Path API Configuration ─────────────────────────────
// The LP API URL is configurable via localStorage
const DEFAULT_LP_API = 'http://localhost:8000';

export function getLPApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lp_api_url') || DEFAULT_LP_API;
  }
  return DEFAULT_LP_API;
}

export function setLPApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lp_api_url', url);
  }
}

export function getAPIEndpoints() {
  const base = getLPApiBaseUrl();
  return {
    health: `${base}/api/v1/health`,
    learningPath: `${base}/api/v1/learning-path`,
    learningPathWeb: `${base}/api/v1/learning-path-web`,
    careers: `${base}/api/v1/careers`,
  };
}

// Gemini is proxied through our Next.js API route
export const GEMINI_MODEL = 'gemini-2.5-flash';
