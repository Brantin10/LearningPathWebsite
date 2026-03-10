import { Question } from '../types';

// 12 essential questions — covers all scoring factors for career matching + AI generation
export const QUESTIONS: Question[] = [
  {
    id: 'desired_role',
    text: 'What career are you interested in?',
    type: 'TEXT',
    required: true,
    helperText: 'e.g. Web Developer, Data Analyst, Electrician',
  },
  {
    id: 'has_job',
    text: 'Do you currently have a job?',
    type: 'YES_NO',
    required: true,
    followUps: [
      {
        id: 'current_title',
        text: 'What is your current job title?',
        type: 'TEXT',
        required: true,
        helperText: 'e.g. Software Developer, Retail Manager',
      },
      {
        id: 'current_years',
        text: 'How many years in this role?',
        type: 'YEARS',
        required: true,
      },
    ],
  },
  {
    id: 'education',
    text: 'Highest completed education?',
    type: 'SINGLE_CHOICE',
    required: true,
    options: ['High school', 'Vocational', "Bachelor's", "Master's", 'PhD'],
  },
  {
    id: 'skills',
    text: 'What are your top skills?',
    type: 'TEXT',
    required: true,
    helperText: 'Separate with commas: Python, Leadership, Design',
  },
  {
    id: 'years_total',
    text: 'Total work experience?',
    type: 'SINGLE_CHOICE',
    required: true,
    options: ['None', '1-2 years', '3-5 years', '5-10 years', '10+ years'],
  },
  {
    id: 'interests',
    text: 'What areas interest you?',
    type: 'MULTI_SELECT',
    required: true,
    helperText: 'Select all that apply',
    options: [
      'Coding',
      'Cloud / DevOps',
      'AI / Machine Learning',
      'Management',
      'Sales / Consulting',
      'Creative / Design',
      'Healthcare',
      'Education',
    ],
  },
  {
    id: 'work_style',
    text: 'How do you prefer to work?',
    type: 'SINGLE_CHOICE',
    required: true,
    options: ['Remote', 'Hybrid', 'On-site', 'No preference'],
  },
  {
    id: 'learning_style',
    text: 'How do you learn best?',
    type: 'SINGLE_CHOICE',
    required: true,
    options: ['Hands-on', 'Online courses', 'Mentorship', 'Self-study'],
  },
  {
    id: 'salary_importance',
    text: 'How important is salary to you?',
    type: 'SCALE_1_5',
    required: true,
    helperText: '1 = Not important \u00B7 5 = Very important',
  },
  {
    id: 'growth_importance',
    text: 'How important is career growth?',
    type: 'SCALE_1_5',
    required: true,
    helperText: '1 = Not important \u00B7 5 = Very important',
  },
  {
    id: 'timeline',
    text: 'When do you want to make a move?',
    type: 'SINGLE_CHOICE',
    required: true,
    options: ['ASAP', '1\u20133 months', '3\u20136 months', '6\u201312 months', '1+ year'],
  },
  {
    id: 'location',
    text: 'Where are you based?',
    type: 'TEXT',
    required: true,
    helperText: 'City or country',
  },
];

// Flatten questions including follow-ups based on answers
export function getVisibleQuestions(answers: Record<string, any>): Question[] {
  const visible: Question[] = [];

  for (const q of QUESTIONS) {
    visible.push(q);

    // Show follow-ups if parent answer is "Yes"
    if (q.followUps && answers[q.id] === 'Yes') {
      visible.push(...q.followUps);
    }
  }

  return visible;
}
