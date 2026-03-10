import { ChatMessage, AppUser } from '../types';

const MAX_CONTEXT_MESSAGES = 20;

function buildSystemPrompt(profile: AppUser): string {
  const careerName = profile.chosenCareer || profile.desiredJob || 'not yet chosen';
  const skills = profile.skills || 'not specified';
  const education = profile.education || 'not specified';
  const currentJob = profile.currentJob || 'not specified';
  const username = profile.username || 'the user';

  return `You are an expert AI Career Coach inside the MyFutureCareer app. Your name is "Career Coach". You help users navigate their career journey with personalized, actionable advice.

ABOUT THE USER:
- Name: ${username}
- Target Career: ${careerName}
- Current Skills: ${skills}
- Education: ${education}
- Current Job: ${currentJob}

YOUR GUIDELINES:
- Give concise, actionable career advice tailored to their specific situation
- Reference their target career, current skills, and background when relevant
- Be encouraging but honest about what it takes to succeed
- Suggest specific resources, skills to learn, and concrete next steps
- If asked about topics unrelated to career/professional development, gently redirect to career topics
- Use short paragraphs and bullet points for readability
- Keep responses under 300 words unless the user asks for detailed analysis
- Never mention that you are a Gemini model or Google product — you are the MyFutureCareer Career Coach`;
}

function toGeminiMessages(
  messages: ChatMessage[],
): Array<{ role: string; parts: Array<{ text: string }> }> {
  return messages.slice(-MAX_CONTEXT_MESSAGES).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
}

export async function sendMessageToGemini(
  messages: ChatMessage[],
  profile: AppUser,
): Promise<string> {
  const systemPrompt = buildSystemPrompt(profile);
  const geminiContents = toGeminiMessages(messages);

  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, contents: geminiContents }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    }
    throw new Error(errorData.error || `API error (${res.status})`);
  }

  const data = await res.json();
  return data.text;
}
