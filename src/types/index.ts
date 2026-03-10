// ── Data Models ─────────────────────────────────────────────────

export interface AppUser {
  uid: string;
  email: string;
  username: string;
  currentJob: string;
  desiredJob: string;
  skills: string;
  education: string;
  birthDate: string;
  avatar: number; // 0-9
  age: string;
  profileCompleted: boolean;
  createdAt: number;
  chosenCareer: string; // career uid
  careerCompleted?: boolean;
  role: 'seeker' | 'employer';
  visibleToEmployers?: boolean; // seekers only, default false
}

export interface Career {
  uid: string;
  name: string;
  category: string;
  skills: string[];
  skillsURL: string[];
  education: string[];
  description: string;
  steps: string[];
  educationPaths: string[];
  educationUrls: string[];
  futureOutlook: string;
  matchingJobs: string[]; // [title, desc, url, title, desc, url...]
}

export interface LearningStep {
  step_number: number;
  title: string;
  explanation: string;
  time_estimate_weeks: number;
  resources?: {
    youtube?: YouTubeResource[];
  };
}

export interface YouTubeResource {
  title: string;
  url: string;
  kind?: string;
  confidence?: number;
}

export interface EvaluationScores {
  overall_score: number;
  step_ordering_score: number;
  accuracy_score: number;
  clarity_score: number;
  relevance_score: number;
  career_path_completeness_score: number;
  knowledge_quality: number;
  career_value: number;
  personalization: number;
  total_penalty: number;
}

export interface LearningPathResponse {
  target_career: string;
  profile_summary: string;
  learning_path: LearningStep[];
  evaluation: EvaluationScores;
  total_weeks: number;
  generated_by: string;
}

// ── Question Types ──────────────────────────────────────────────

export type QuestionType = 'TEXT' | 'YES_NO' | 'SINGLE_CHOICE' | 'MULTI_SELECT' | 'SCALE_1_5' | 'YEARS';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  helperText?: string;
  followUps?: Question[]; // shown if answer is "Yes"
}

export type Answers = Record<string, any>;

// ── Job Model ───────────────────────────────────────────────────

export interface Job {
  title: string;
  description: string;
  url: string;
}

// ── Job Search Types ────────────────────────────────────────────

export interface RemoteOKJob {
  id: string;
  slug: string;
  position: string;
  company: string;
  company_logo: string;
  location: string;
  date: string;
  epoch: number;
  salary_min: number;
  salary_max: number;
  tags: string[];
  description: string;
  url: string;
}

export interface SavedJob {
  id: string;
  source: 'remoteok';
  externalId: string;
  position: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  tags: string[];
  applyUrl: string;
  savedAt: number;
}

// ── Interview Prep Types ────────────────────────────────────────

export type InterviewCategory =
  | 'Coding'
  | 'Cloud / DevOps'
  | 'AI / Machine Learning'
  | 'Management'
  | 'Sales / Consulting'
  | 'Creative / Design'
  | 'Healthcare'
  | 'Education';

export type InterviewQuestionType = 'behavioral' | 'technical' | 'situational';

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  type: InterviewQuestionType;
  question: string;
  sampleAnswer: string;
  tips: string[];
  starGuidance: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface InterviewAttempt {
  questionId: string;
  userAnswer: string;
  attemptedAt: number;
  selfRating: number;
}

// ── Application Tracker Types ───────────────────────────────────

export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: number;
  notes: string;
  url: string;
  source: 'manual' | 'job_search';
  lastUpdated: number;
}

// ── Progress & Gamification Types ───────────────────────────

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  action: string; // "completed_step", "started_career", etc.
  details?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  earned: boolean;
}

// ── Skills Gap Types ────────────────────────────────────────

export interface SkillMatch {
  skill: string;
  status: 'matched' | 'missing' | 'partial';
  userSkill?: string;
  priority: 'high' | 'medium' | 'low';
  learnUrl?: string;
}

export interface SkillsGapAnalysis {
  matchedSkills: SkillMatch[];
  missingSkills: SkillMatch[];
  matchPercentage: number;
  totalRequired: number;
}

// ── Notification Types ──────────────────────────────────────

export interface NotificationPreferences {
  enabled: boolean;
  types: {
    daily_reminder: boolean;
    streak_reminder: boolean;
    application_followup: boolean;
    weekly_summary: boolean;
  };
  dailyReminderTime: string; // "HH:MM" 24-hour format
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  enabled: false,
  types: {
    daily_reminder: true,
    streak_reminder: true,
    application_followup: true,
    weekly_summary: true,
  },
  dailyReminderTime: '09:00',
};

// ── Resume / CV Types ─────────────────────────────────────────

export interface ResumeContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
}

export interface ResumeWorkEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface ResumeEducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface ResumeCertEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  contact: ResumeContactInfo;
  summary: string;
  workExperience: ResumeWorkEntry[];
  education: ResumeEducationEntry[];
  skills: string[];
  certifications: ResumeCertEntry[];
  targetCareer: string;
  learningProgress: string;
  updatedAt: number;
}

// ── Salary Insights Types ─────────────────────────────────────

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
}

export interface CareerSalaryData {
  careerName: string;
  entryLevel: SalaryRange;
  midLevel: SalaryRange;
  seniorLevel: SalaryRange;
  growthRate: string;
  source: string;
}

// ── Community / Forum Types ───────────────────────────────────

export interface CommunityPost {
  id: string;
  title: string;
  body: string;
  authorUid: string;
  authorName: string;
  authorAvatar: number;
  category: string;
  createdAt: number;
  upvotes: number;
  upvotedBy: string[];
  replyCount: number;
  reported: boolean;
  reportedBy: string[];
}

export interface CommunityReply {
  id: string;
  body: string;
  authorUid: string;
  authorName: string;
  authorAvatar: number;
  createdAt: number;
  upvotes: number;
  upvotedBy: string[];
  reported: boolean;
  reportedBy: string[];
}

// ── Networking Resource Types ─────────────────────────────────

export interface NetworkingResource {
  title: string;
  url: string;
  type: 'reddit' | 'discord' | 'linkedin' | 'website' | 'forum';
  description: string;
}

export interface NetworkingCategory {
  category: string;
  communities: NetworkingResource[];
  tips: string[];
  mentorshipAdvice: string[];
}

// ── AI Chat Types ─────────────────────────────────────────────

export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: number;
}

export interface AIConversation {
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// ── Daily Action Types ────────────────────────────────────────

export type DailyActionType = 'learning' | 'job' | 'interview' | 'resume' | 'networking' | 'community' | 'skills';

export interface DailyAction {
  id: string;
  type: DailyActionType;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

export interface DailyActionsPrefs {
  enabled: boolean;
  showOnHome: boolean;
  actionsPerDay: number;
}

export const DEFAULT_DAILY_PREFS: DailyActionsPrefs = {
  enabled: true,
  showOnHome: true,
  actionsPerDay: 3,
};

export interface DailyActionsState {
  date: string; // YYYY-MM-DD
  actions: DailyAction[];
  prefs: DailyActionsPrefs;
}

// ── Employer / Recruiter Types ──────────────────────────────────

export interface EmployerBookmark {
  seekerUid: string;
  savedAt: number;
  seekerName: string;       // denormalized for list display
  seekerAvatar: number;
  seekerCareer: string;
  seekerSkills: string;
}

export interface CandidateListItem {
  uid: string;
  username: string;
  avatar: number;
  skills: string;
  chosenCareer: string;
  education: string;
  age: string;
  currentJob: string;
  profileCompleted: boolean;
}

// ── Contact Request / Messaging Types ───────────────────────────

export type ContactRequestStatus = 'pending' | 'accepted' | 'declined';

export interface ContactRequest {
  id: string;
  fromUid: string;
  fromName: string;
  fromAvatar: number;
  fromRole: 'seeker' | 'employer';
  toUid: string;
  toName: string;
  toAvatar: number;
  message: string;
  status: ContactRequestStatus;
  createdAt: number;
  respondedAt?: number;
}

export interface DirectMessage {
  id: string;
  senderUid: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  participants: string[]; // [uid1, uid2]
  participantNames: Record<string, string>;
  participantAvatars: Record<string, number>;
  lastMessage: string;
  lastMessageAt: number;
  createdAt: number;
}
