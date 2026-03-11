'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

// Map route segments to human-readable names
const ROUTE_NAMES: Record<string, string> = {
  'career-detail': 'Career Detail',
  'career-manager': 'Career Manager',
  'career-match': 'Career Match',
  'interview-question': 'Question',
  'interview-category': 'Category',
  'interview-prep': 'Interview Prep',
  'community-post': 'Post',
  'community-new': 'New Post',
  'community': 'Community',
  'application-detail': 'Application Detail',
  'application-tracker': 'Applications',
  'application-add': 'Add Application',
  'employer-candidate': 'Candidate',
  'employer-browse': 'Browse',
  'employer-home': 'Employer',
  'employer-saved': 'Saved',
  'conversation': 'Conversation',
  'inbox': 'Inbox',
  'steps': 'Learning Steps',
  'education': 'Education',
  'skills': 'Skills',
  'job-search': 'Job Search',
  'saved-jobs': 'Saved Jobs',
  'jobs': 'Jobs',
};

// Map to parent routes for context
const PARENT_ROUTES: Record<string, { label: string; path: string }> = {
  'career-detail': { label: 'Career Match', path: '/career-match' },
  'interview-question': { label: 'Interview Prep', path: '/interview-prep' },
  'interview-category': { label: 'Interview Prep', path: '/interview-prep' },
  'community-post': { label: 'Community', path: '/community' },
  'community-new': { label: 'Community', path: '/community' },
  'application-detail': { label: 'Applications', path: '/application-tracker' },
  'application-add': { label: 'Applications', path: '/application-tracker' },
  'employer-candidate': { label: 'Browse', path: '/employer-browse' },
  'employer-saved': { label: 'Employer', path: '/employer-home' },
  'employer-browse': { label: 'Employer', path: '/employer-home' },
  'conversation': { label: 'Inbox', path: '/inbox' },
  'steps': { label: 'Career Manager', path: '/career-manager' },
  'education': { label: 'Career Manager', path: '/career-manager' },
  'skills': { label: 'Career Manager', path: '/career-manager' },
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Get the current route segment (e.g., "/career-detail" -> "career-detail")
  const segment = pathname.replace(/^\//, '').split('/')[0];

  // Don't render if we can't find a name for this route
  const currentName = ROUTE_NAMES[segment];
  if (!currentName) return null;

  const parent = PARENT_ROUTES[segment];

  return (
    <nav className="flex items-center gap-1.5 mb-4 flex-wrap" aria-label="Breadcrumb">
      <Link
        href="/home"
        className="text-xs text-text-muted hover:text-text-secondary transition-colors"
      >
        <Home size={24} />
      </Link>

      {parent && (
        <>
          <ChevronRight size={24} className="text-text-muted" />
          <Link
            href={parent.path}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            {parent.label}
          </Link>
        </>
      )}

      <ChevronRight size={24} className="text-text-muted" />
      <span className="text-xs text-text-secondary">{currentName}</span>
    </nav>
  );
}
