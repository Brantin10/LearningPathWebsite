export interface AppRoute {
  label: string;
  path: string;
  icon: string; // emoji
  description: string;
  category: 'career' | 'jobs' | 'learning' | 'community' | 'employer' | 'tools' | 'settings';
}

export const APP_ROUTES: AppRoute[] = [
  // ── Career ────────────────────────────────────────────────
  {
    label: 'AI Coach',
    path: '/ai-chat',
    icon: '\u2728',
    description: 'Get personalized career advice from AI',
    category: 'career',
  },
  {
    label: 'Career Quiz',
    path: '/questionnaire',
    icon: '\u2753',
    description: 'Answer questions to find your career match',
    category: 'career',
  },
  {
    label: 'Find Careers',
    path: '/career-match',
    icon: '\uD83D\uDD0D',
    description: 'Discover your top career matches',
    category: 'career',
  },
  {
    label: 'My Career',
    path: '/career-manager',
    icon: '\uD83D\uDCBC',
    description: 'View your career path and progress',
    category: 'career',
  },
  {
    label: 'Career Detail',
    path: '/career-detail',
    icon: '\uD83D\uDCCB',
    description: 'Detailed breakdown of a career path',
    category: 'career',
  },
  {
    label: 'Skills Gap',
    path: '/skills-gap',
    icon: '\u26A1',
    description: 'Analyze your skills vs career requirements',
    category: 'career',
  },
  {
    label: 'Salary Insights',
    path: '/salary-insights',
    icon: '\uD83D\uDCB0',
    description: 'See salary ranges for your career',
    category: 'career',
  },
  {
    label: 'My Journey',
    path: '/progress-story',
    icon: '\uD83D\uDCD6',
    description: 'Your before & after progress story',
    category: 'career',
  },
  {
    label: 'Steps',
    path: '/steps',
    icon: '\uD83E\uDEA7',
    description: 'Step-by-step career action plan',
    category: 'career',
  },

  // ── Jobs ──────────────────────────────────────────────────
  {
    label: 'Job Search',
    path: '/job-search',
    icon: '\uD83C\uDF10',
    description: 'Find remote job openings',
    category: 'jobs',
  },
  {
    label: 'Saved Jobs',
    path: '/saved-jobs',
    icon: '\uD83D\uDCCC',
    description: 'View your bookmarked job listings',
    category: 'jobs',
  },
  {
    label: 'Applications',
    path: '/application-tracker',
    icon: '\uD83D\uDCCA',
    description: 'Track your job applications',
    category: 'jobs',
  },
  {
    label: 'Add Application',
    path: '/application-add',
    icon: '\u2795',
    description: 'Log a new job application',
    category: 'jobs',
  },
  {
    label: 'Application Detail',
    path: '/application-detail',
    icon: '\uD83D\uDCC4',
    description: 'View details of an application',
    category: 'jobs',
  },
  {
    label: 'Interview Prep',
    path: '/interview-prep',
    icon: '\uD83D\uDCAC',
    description: 'Practice with STAR method',
    category: 'jobs',
  },
  {
    label: 'Interview Category',
    path: '/interview-category',
    icon: '\uD83C\uDFAF',
    description: 'Browse interview question categories',
    category: 'jobs',
  },
  {
    label: 'Interview Question',
    path: '/interview-question',
    icon: '\uD83D\uDDE3\uFE0F',
    description: 'Practice a specific interview question',
    category: 'jobs',
  },
  {
    label: 'Resume',
    path: '/cv',
    icon: '\uD83D\uDCC4',
    description: 'Build and share your CV',
    category: 'jobs',
  },

  // ── Learning ──────────────────────────────────────────────
  {
    label: 'Daily Actions',
    path: '/daily-actions',
    icon: '\u2705',
    description: 'Your personalized daily to-dos',
    category: 'learning',
  },
  {
    label: 'Skill Quiz',
    path: '/skill-quiz',
    icon: '\uD83E\uDDE0',
    description: 'Test your knowledge with quick quizzes',
    category: 'learning',
  },
  {
    label: 'Progress',
    path: '/progress',
    icon: '\uD83D\uDCC8',
    description: 'Track streaks, badges and progress',
    category: 'learning',
  },
  {
    label: 'Skills',
    path: '/skills',
    icon: '\uD83D\uDEE0\uFE0F',
    description: 'Manage your skills inventory',
    category: 'learning',
  },
  {
    label: 'Education',
    path: '/education',
    icon: '\uD83C\uDF93',
    description: 'Add your education background',
    category: 'learning',
  },
  {
    label: 'How to Get Started',
    path: '/guide',
    icon: '\uD83D\uDCD8',
    description: 'Beginner guide to using the platform',
    category: 'learning',
  },

  // ── Community ─────────────────────────────────────────────
  {
    label: 'Community',
    path: '/community',
    icon: '\uD83D\uDCAC',
    description: 'Discuss with other career changers',
    category: 'community',
  },
  {
    label: 'New Post',
    path: '/community-new',
    icon: '\u270F\uFE0F',
    description: 'Write a new community post',
    category: 'community',
  },
  {
    label: 'Networking',
    path: '/networking',
    icon: '\uD83E\uDD1D',
    description: 'Communities, mentors and tips',
    category: 'community',
  },
  {
    label: 'Inbox',
    path: '/inbox',
    icon: '\uD83D\uDCE5',
    description: 'Messages and contact requests',
    category: 'community',
  },
  {
    label: 'Conversation',
    path: '/conversation',
    icon: '\uD83D\uDCE8',
    description: 'View a message thread',
    category: 'community',
  },

  // ── Employer ──────────────────────────────────────────────
  {
    label: 'Employer Home',
    path: '/employer-home',
    icon: '\uD83C\uDFE2',
    description: 'Employer dashboard overview',
    category: 'employer',
  },
  {
    label: 'Browse Candidates',
    path: '/employer-browse',
    icon: '\uD83D\uDC65',
    description: 'Search and filter candidates',
    category: 'employer',
  },
  {
    label: 'Saved Candidates',
    path: '/employer-saved',
    icon: '\u2B50',
    description: 'Your shortlisted candidates',
    category: 'employer',
  },
  {
    label: 'Candidate Profile',
    path: '/employer-candidate',
    icon: '\uD83D\uDCCB',
    description: 'View a candidate in detail',
    category: 'employer',
  },
  {
    label: 'Post Jobs',
    path: '/jobs',
    icon: '\uD83D\uDCE2',
    description: 'Create and manage job postings',
    category: 'employer',
  },

  // ── Tools ─────────────────────────────────────────────────
  {
    label: 'Home',
    path: '/home',
    icon: '\uD83C\uDFE0',
    description: 'Go to the main dashboard',
    category: 'tools',
  },
  {
    label: 'Onboarding',
    path: '/onboarding',
    icon: '\uD83D\uDE80',
    description: 'Set up your profile for the first time',
    category: 'tools',
  },

  // ── Settings ──────────────────────────────────────────────
  {
    label: 'Profile',
    path: '/profile-setup',
    icon: '\uD83D\uDC64',
    description: 'Edit your skills and experience',
    category: 'settings',
  },
  {
    label: 'Avatar',
    path: '/avatar',
    icon: '\uD83D\uDDBC\uFE0F',
    description: 'Choose your profile avatar',
    category: 'settings',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: '\u2699\uFE0F',
    description: 'Privacy, notifications & account',
    category: 'settings',
  },
  {
    label: 'Notification Settings',
    path: '/notification-settings',
    icon: '\uD83D\uDD14',
    description: 'Manage your notification preferences',
    category: 'settings',
  },
  {
    label: 'Login',
    path: '/login',
    icon: '\uD83D\uDD11',
    description: 'Sign in to your account',
    category: 'settings',
  },
  {
    label: 'Sign Up',
    path: '/signup',
    icon: '\uD83D\uDCDD',
    description: 'Create a new account',
    category: 'settings',
  },
  {
    label: 'Forgot Password',
    path: '/forgot-password',
    icon: '\uD83D\uDD12',
    description: 'Reset your account password',
    category: 'settings',
  },
];

export const CATEGORY_LABELS: Record<AppRoute['category'], string> = {
  career: 'Career',
  jobs: 'Jobs & Applications',
  learning: 'Learning & Progress',
  community: 'Community',
  employer: 'Employer',
  tools: 'Tools',
  settings: 'Settings & Account',
};
