import { getAPIEndpoints } from '../config/api';
import { LearningPathResponse } from '../types';

interface GeneratePathRequest {
  user_uid: string;
  target_career: string;
  age?: number;
  education?: string;
  skills?: string;
  current_job?: string;
}

export async function checkApiHealth(): Promise<{ ok: boolean; modelLoaded: boolean }> {
  try {
    const endpoints = getAPIEndpoints();
    const res = await fetch(endpoints.health, { method: 'GET' });
    if (!res.ok) return { ok: false, modelLoaded: false };
    const data = await res.json();
    return { ok: true, modelLoaded: data.model_loaded === true };
  } catch {
    return { ok: false, modelLoaded: false };
  }
}

export async function generateLearningPath(
  request: GeneratePathRequest,
): Promise<LearningPathResponse> {
  const endpoints = getAPIEndpoints();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000);

  try {
    const res = await fetch(endpoints.learningPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `Server error (${res.status})`);
    }

    return await res.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Generation timed out. The server may be busy — try again.');
    }
    if (error.message?.includes('Failed to fetch')) {
      throw new Error(
        'Cannot reach the Learning Path server. Check the server URL in Settings.',
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getTrainedCareers(): Promise<string[]> {
  try {
    const endpoints = getAPIEndpoints();
    const res = await fetch(endpoints.careers, { method: 'GET' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.careers || [];
  } catch {
    return [];
  }
}
