import { CareerSalaryData } from '../types';

const SOURCE = 'U.S. Bureau of Labor Statistics, 2024';

const SALARY_DATA: Record<string, CareerSalaryData> = {
  // ═══════════════════════════════════════════════════════════════
  // SOFTWARE / CODING
  // ═══════════════════════════════════════════════════════════════
  'web developer': {
    careerName: 'Web Developer',
    entryLevel: { min: 45000, max: 60000, median: 52000 },
    midLevel: { min: 65000, max: 90000, median: 78000 },
    seniorLevel: { min: 95000, max: 130000, median: 112000 },
    growthRate: '16% (much faster than average)',
    source: SOURCE,
  },
  'software developer': {
    careerName: 'Software Developer',
    entryLevel: { min: 55000, max: 75000, median: 65000 },
    midLevel: { min: 80000, max: 115000, median: 98000 },
    seniorLevel: { min: 120000, max: 170000, median: 145000 },
    growthRate: '25% (much faster than average)',
    source: SOURCE,
  },
  'software engineer': {
    careerName: 'Software Engineer',
    entryLevel: { min: 60000, max: 80000, median: 70000 },
    midLevel: { min: 90000, max: 125000, median: 108000 },
    seniorLevel: { min: 130000, max: 180000, median: 155000 },
    growthRate: '25% (much faster than average)',
    source: SOURCE,
  },
  'mobile developer': {
    careerName: 'Mobile Developer',
    entryLevel: { min: 55000, max: 72000, median: 63000 },
    midLevel: { min: 80000, max: 110000, median: 95000 },
    seniorLevel: { min: 115000, max: 160000, median: 138000 },
    growthRate: '22% (much faster than average)',
    source: SOURCE,
  },
  'full stack developer': {
    careerName: 'Full Stack Developer',
    entryLevel: { min: 52000, max: 70000, median: 61000 },
    midLevel: { min: 75000, max: 105000, median: 90000 },
    seniorLevel: { min: 110000, max: 155000, median: 132000 },
    growthRate: '20% (much faster than average)',
    source: SOURCE,
  },
  'frontend developer': {
    careerName: 'Frontend Developer',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 70000, max: 95000, median: 82000 },
    seniorLevel: { min: 100000, max: 140000, median: 120000 },
    growthRate: '16% (much faster than average)',
    source: SOURCE,
  },
  'backend developer': {
    careerName: 'Backend Developer',
    entryLevel: { min: 55000, max: 72000, median: 63000 },
    midLevel: { min: 80000, max: 110000, median: 95000 },
    seniorLevel: { min: 115000, max: 160000, median: 138000 },
    growthRate: '18% (much faster than average)',
    source: SOURCE,
  },
  'game developer': {
    careerName: 'Game Developer',
    entryLevel: { min: 42000, max: 60000, median: 50000 },
    midLevel: { min: 60000, max: 90000, median: 75000 },
    seniorLevel: { min: 90000, max: 130000, median: 110000 },
    growthRate: '11% (faster than average)',
    source: SOURCE,
  },
  'embedded systems engineer': {
    careerName: 'Embedded Systems Engineer',
    entryLevel: { min: 58000, max: 75000, median: 66000 },
    midLevel: { min: 80000, max: 110000, median: 95000 },
    seniorLevel: { min: 110000, max: 150000, median: 130000 },
    growthRate: '5% (about as fast as average)',
    source: SOURCE,
  },
  'qa engineer': {
    careerName: 'QA Engineer',
    entryLevel: { min: 45000, max: 60000, median: 52000 },
    midLevel: { min: 65000, max: 90000, median: 77000 },
    seniorLevel: { min: 90000, max: 125000, median: 108000 },
    growthRate: '20% (much faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // CLOUD / DEVOPS / INFRASTRUCTURE
  // ═══════════════════════════════════════════════════════════════
  'devops engineer': {
    careerName: 'DevOps Engineer',
    entryLevel: { min: 60000, max: 80000, median: 70000 },
    midLevel: { min: 90000, max: 120000, median: 105000 },
    seniorLevel: { min: 125000, max: 170000, median: 148000 },
    growthRate: '22% (much faster than average)',
    source: SOURCE,
  },
  'cloud engineer': {
    careerName: 'Cloud Engineer',
    entryLevel: { min: 60000, max: 82000, median: 71000 },
    midLevel: { min: 90000, max: 125000, median: 108000 },
    seniorLevel: { min: 130000, max: 175000, median: 152000 },
    growthRate: '23% (much faster than average)',
    source: SOURCE,
  },
  'cloud architect': {
    careerName: 'Cloud Architect',
    entryLevel: { min: 80000, max: 105000, median: 92000 },
    midLevel: { min: 115000, max: 150000, median: 132000 },
    seniorLevel: { min: 155000, max: 210000, median: 180000 },
    growthRate: '23% (much faster than average)',
    source: SOURCE,
  },
  'systems administrator': {
    careerName: 'Systems Administrator',
    entryLevel: { min: 45000, max: 60000, median: 52000 },
    midLevel: { min: 60000, max: 85000, median: 72000 },
    seniorLevel: { min: 85000, max: 115000, median: 100000 },
    growthRate: '3% (slower than average)',
    source: SOURCE,
  },
  'network engineer': {
    careerName: 'Network Engineer',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 70000, max: 95000, median: 82000 },
    seniorLevel: { min: 95000, max: 130000, median: 112000 },
    growthRate: '3% (slower than average)',
    source: SOURCE,
  },
  'site reliability engineer': {
    careerName: 'Site Reliability Engineer',
    entryLevel: { min: 70000, max: 95000, median: 82000 },
    midLevel: { min: 100000, max: 140000, median: 120000 },
    seniorLevel: { min: 145000, max: 195000, median: 170000 },
    growthRate: '22% (much faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // AI / DATA SCIENCE / MACHINE LEARNING
  // ═══════════════════════════════════════════════════════════════
  'data scientist': {
    careerName: 'Data Scientist',
    entryLevel: { min: 65000, max: 85000, median: 75000 },
    midLevel: { min: 95000, max: 130000, median: 112000 },
    seniorLevel: { min: 135000, max: 185000, median: 160000 },
    growthRate: '35% (much faster than average)',
    source: SOURCE,
  },
  'machine learning engineer': {
    careerName: 'Machine Learning Engineer',
    entryLevel: { min: 70000, max: 95000, median: 82000 },
    midLevel: { min: 105000, max: 145000, median: 125000 },
    seniorLevel: { min: 150000, max: 210000, median: 180000 },
    growthRate: '35% (much faster than average)',
    source: SOURCE,
  },
  'ai engineer': {
    careerName: 'AI Engineer',
    entryLevel: { min: 75000, max: 100000, median: 87000 },
    midLevel: { min: 110000, max: 150000, median: 130000 },
    seniorLevel: { min: 155000, max: 220000, median: 188000 },
    growthRate: '35% (much faster than average)',
    source: SOURCE,
  },
  'data analyst': {
    careerName: 'Data Analyst',
    entryLevel: { min: 42000, max: 58000, median: 50000 },
    midLevel: { min: 60000, max: 82000, median: 70000 },
    seniorLevel: { min: 82000, max: 110000, median: 96000 },
    growthRate: '23% (much faster than average)',
    source: SOURCE,
  },
  'data engineer': {
    careerName: 'Data Engineer',
    entryLevel: { min: 60000, max: 80000, median: 70000 },
    midLevel: { min: 85000, max: 120000, median: 102000 },
    seniorLevel: { min: 125000, max: 170000, median: 148000 },
    growthRate: '28% (much faster than average)',
    source: SOURCE,
  },
  'business intelligence analyst': {
    careerName: 'Business Intelligence Analyst',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 68000, max: 92000, median: 80000 },
    seniorLevel: { min: 95000, max: 125000, median: 110000 },
    growthRate: '23% (much faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // CYBERSECURITY
  // ═══════════════════════════════════════════════════════════════
  'cybersecurity analyst': {
    careerName: 'Cybersecurity Analyst',
    entryLevel: { min: 55000, max: 72000, median: 63000 },
    midLevel: { min: 78000, max: 108000, median: 93000 },
    seniorLevel: { min: 110000, max: 150000, median: 130000 },
    growthRate: '32% (much faster than average)',
    source: SOURCE,
  },
  'security engineer': {
    careerName: 'Security Engineer',
    entryLevel: { min: 62000, max: 82000, median: 72000 },
    midLevel: { min: 90000, max: 125000, median: 108000 },
    seniorLevel: { min: 130000, max: 175000, median: 152000 },
    growthRate: '32% (much faster than average)',
    source: SOURCE,
  },
  'penetration tester': {
    careerName: 'Penetration Tester',
    entryLevel: { min: 55000, max: 75000, median: 65000 },
    midLevel: { min: 80000, max: 110000, median: 95000 },
    seniorLevel: { min: 115000, max: 155000, median: 135000 },
    growthRate: '32% (much faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // MANAGEMENT / LEADERSHIP
  // ═══════════════════════════════════════════════════════════════
  'project manager': {
    careerName: 'Project Manager',
    entryLevel: { min: 50000, max: 68000, median: 58000 },
    midLevel: { min: 72000, max: 100000, median: 86000 },
    seniorLevel: { min: 105000, max: 145000, median: 125000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'product manager': {
    careerName: 'Product Manager',
    entryLevel: { min: 60000, max: 82000, median: 70000 },
    midLevel: { min: 90000, max: 125000, median: 108000 },
    seniorLevel: { min: 130000, max: 180000, median: 155000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },
  'it manager': {
    careerName: 'IT Manager',
    entryLevel: { min: 60000, max: 80000, median: 70000 },
    midLevel: { min: 85000, max: 115000, median: 100000 },
    seniorLevel: { min: 120000, max: 165000, median: 142000 },
    growthRate: '15% (much faster than average)',
    source: SOURCE,
  },
  'engineering manager': {
    careerName: 'Engineering Manager',
    entryLevel: { min: 85000, max: 110000, median: 97000 },
    midLevel: { min: 120000, max: 160000, median: 140000 },
    seniorLevel: { min: 160000, max: 220000, median: 190000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },
  'operations manager': {
    careerName: 'Operations Manager',
    entryLevel: { min: 45000, max: 60000, median: 52000 },
    midLevel: { min: 62000, max: 88000, median: 75000 },
    seniorLevel: { min: 90000, max: 130000, median: 110000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'business analyst': {
    careerName: 'Business Analyst',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 68000, max: 92000, median: 80000 },
    seniorLevel: { min: 95000, max: 125000, median: 110000 },
    growthRate: '9% (faster than average)',
    source: SOURCE,
  },
  'scrum master': {
    careerName: 'Scrum Master',
    entryLevel: { min: 55000, max: 75000, median: 65000 },
    midLevel: { min: 80000, max: 110000, median: 95000 },
    seniorLevel: { min: 110000, max: 145000, median: 128000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },
  'management consultant': {
    careerName: 'Management Consultant',
    entryLevel: { min: 55000, max: 75000, median: 65000 },
    midLevel: { min: 82000, max: 120000, median: 100000 },
    seniorLevel: { min: 125000, max: 180000, median: 152000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // SALES / CONSULTING / MARKETING
  // ═══════════════════════════════════════════════════════════════
  'sales manager': {
    careerName: 'Sales Manager',
    entryLevel: { min: 42000, max: 58000, median: 50000 },
    midLevel: { min: 62000, max: 95000, median: 78000 },
    seniorLevel: { min: 100000, max: 155000, median: 127000 },
    growthRate: '4% (about as fast as average)',
    source: SOURCE,
  },
  'account manager': {
    careerName: 'Account Manager',
    entryLevel: { min: 38000, max: 52000, median: 45000 },
    midLevel: { min: 55000, max: 78000, median: 66000 },
    seniorLevel: { min: 80000, max: 115000, median: 97000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'digital marketer': {
    careerName: 'Digital Marketer',
    entryLevel: { min: 38000, max: 52000, median: 45000 },
    midLevel: { min: 55000, max: 78000, median: 66000 },
    seniorLevel: { min: 82000, max: 115000, median: 98000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },
  'marketing manager': {
    careerName: 'Marketing Manager',
    entryLevel: { min: 45000, max: 62000, median: 53000 },
    midLevel: { min: 68000, max: 98000, median: 82000 },
    seniorLevel: { min: 100000, max: 150000, median: 125000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'seo specialist': {
    careerName: 'SEO Specialist',
    entryLevel: { min: 35000, max: 48000, median: 42000 },
    midLevel: { min: 50000, max: 72000, median: 60000 },
    seniorLevel: { min: 75000, max: 105000, median: 90000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },
  'content strategist': {
    careerName: 'Content Strategist',
    entryLevel: { min: 38000, max: 52000, median: 45000 },
    midLevel: { min: 55000, max: 78000, median: 66000 },
    seniorLevel: { min: 80000, max: 110000, median: 95000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // CREATIVE / DESIGN
  // ═══════════════════════════════════════════════════════════════
  'ux designer': {
    careerName: 'UX Designer',
    entryLevel: { min: 50000, max: 68000, median: 58000 },
    midLevel: { min: 72000, max: 100000, median: 86000 },
    seniorLevel: { min: 105000, max: 145000, median: 125000 },
    growthRate: '16% (much faster than average)',
    source: SOURCE,
  },
  'ui designer': {
    careerName: 'UI Designer',
    entryLevel: { min: 45000, max: 62000, median: 53000 },
    midLevel: { min: 65000, max: 90000, median: 78000 },
    seniorLevel: { min: 92000, max: 130000, median: 110000 },
    growthRate: '16% (much faster than average)',
    source: SOURCE,
  },
  'graphic designer': {
    careerName: 'Graphic Designer',
    entryLevel: { min: 32000, max: 45000, median: 38000 },
    midLevel: { min: 45000, max: 65000, median: 55000 },
    seniorLevel: { min: 65000, max: 90000, median: 78000 },
    growthRate: '3% (slower than average)',
    source: SOURCE,
  },
  'product designer': {
    careerName: 'Product Designer',
    entryLevel: { min: 55000, max: 72000, median: 63000 },
    midLevel: { min: 80000, max: 110000, median: 95000 },
    seniorLevel: { min: 115000, max: 160000, median: 138000 },
    growthRate: '16% (much faster than average)',
    source: SOURCE,
  },
  'motion designer': {
    careerName: 'Motion Designer',
    entryLevel: { min: 38000, max: 52000, median: 45000 },
    midLevel: { min: 55000, max: 78000, median: 66000 },
    seniorLevel: { min: 80000, max: 115000, median: 97000 },
    growthRate: '5% (about as fast as average)',
    source: SOURCE,
  },
  'video editor': {
    careerName: 'Video Editor',
    entryLevel: { min: 30000, max: 42000, median: 36000 },
    midLevel: { min: 42000, max: 62000, median: 52000 },
    seniorLevel: { min: 62000, max: 90000, median: 76000 },
    growthRate: '12% (faster than average)',
    source: SOURCE,
  },
  'technical writer': {
    careerName: 'Technical Writer',
    entryLevel: { min: 42000, max: 58000, median: 50000 },
    midLevel: { min: 60000, max: 82000, median: 70000 },
    seniorLevel: { min: 85000, max: 115000, median: 100000 },
    growthRate: '7% (about as fast as average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // HEALTHCARE
  // ═══════════════════════════════════════════════════════════════
  'registered nurse': {
    careerName: 'Registered Nurse',
    entryLevel: { min: 52000, max: 65000, median: 58000 },
    midLevel: { min: 68000, max: 90000, median: 78000 },
    seniorLevel: { min: 90000, max: 120000, median: 105000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'nurse practitioner': {
    careerName: 'Nurse Practitioner',
    entryLevel: { min: 82000, max: 100000, median: 90000 },
    midLevel: { min: 100000, max: 130000, median: 115000 },
    seniorLevel: { min: 130000, max: 160000, median: 145000 },
    growthRate: '40% (much faster than average)',
    source: SOURCE,
  },
  'physician assistant': {
    careerName: 'Physician Assistant',
    entryLevel: { min: 85000, max: 105000, median: 95000 },
    midLevel: { min: 105000, max: 135000, median: 120000 },
    seniorLevel: { min: 135000, max: 170000, median: 152000 },
    growthRate: '27% (much faster than average)',
    source: SOURCE,
  },
  'medical assistant': {
    careerName: 'Medical Assistant',
    entryLevel: { min: 28000, max: 35000, median: 31000 },
    midLevel: { min: 35000, max: 45000, median: 40000 },
    seniorLevel: { min: 45000, max: 55000, median: 50000 },
    growthRate: '14% (faster than average)',
    source: SOURCE,
  },
  'pharmacist': {
    careerName: 'Pharmacist',
    entryLevel: { min: 100000, max: 120000, median: 110000 },
    midLevel: { min: 120000, max: 140000, median: 130000 },
    seniorLevel: { min: 140000, max: 165000, median: 152000 },
    growthRate: '3% (slower than average)',
    source: SOURCE,
  },
  'physical therapist': {
    careerName: 'Physical Therapist',
    entryLevel: { min: 62000, max: 78000, median: 70000 },
    midLevel: { min: 78000, max: 100000, median: 88000 },
    seniorLevel: { min: 100000, max: 125000, median: 112000 },
    growthRate: '15% (much faster than average)',
    source: SOURCE,
  },
  'health informatics specialist': {
    careerName: 'Health Informatics Specialist',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 68000, max: 92000, median: 80000 },
    seniorLevel: { min: 95000, max: 125000, median: 110000 },
    growthRate: '17% (much faster than average)',
    source: SOURCE,
  },
  'dental hygienist': {
    careerName: 'Dental Hygienist',
    entryLevel: { min: 55000, max: 68000, median: 62000 },
    midLevel: { min: 68000, max: 85000, median: 77000 },
    seniorLevel: { min: 85000, max: 105000, median: 95000 },
    growthRate: '7% (about as fast as average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // EDUCATION
  // ═══════════════════════════════════════════════════════════════
  'teacher': {
    careerName: 'Teacher',
    entryLevel: { min: 35000, max: 45000, median: 40000 },
    midLevel: { min: 45000, max: 60000, median: 52000 },
    seniorLevel: { min: 60000, max: 80000, median: 70000 },
    growthRate: '4% (about as fast as average)',
    source: SOURCE,
  },
  'instructional designer': {
    careerName: 'Instructional Designer',
    entryLevel: { min: 42000, max: 55000, median: 48000 },
    midLevel: { min: 58000, max: 78000, median: 68000 },
    seniorLevel: { min: 80000, max: 108000, median: 94000 },
    growthRate: '7% (about as fast as average)',
    source: SOURCE,
  },
  'school counselor': {
    careerName: 'School Counselor',
    entryLevel: { min: 38000, max: 48000, median: 43000 },
    midLevel: { min: 48000, max: 62000, median: 55000 },
    seniorLevel: { min: 62000, max: 80000, median: 71000 },
    growthRate: '5% (about as fast as average)',
    source: SOURCE,
  },
  'corporate trainer': {
    careerName: 'Corporate Trainer',
    entryLevel: { min: 40000, max: 52000, median: 46000 },
    midLevel: { min: 55000, max: 75000, median: 65000 },
    seniorLevel: { min: 78000, max: 105000, median: 91000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'education administrator': {
    careerName: 'Education Administrator',
    entryLevel: { min: 55000, max: 70000, median: 62000 },
    midLevel: { min: 72000, max: 95000, median: 83000 },
    seniorLevel: { min: 95000, max: 130000, median: 112000 },
    growthRate: '4% (about as fast as average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // TRADES / SKILLED LABOR
  // ═══════════════════════════════════════════════════════════════
  'electrician': {
    careerName: 'Electrician',
    entryLevel: { min: 35000, max: 45000, median: 40000 },
    midLevel: { min: 48000, max: 65000, median: 56000 },
    seniorLevel: { min: 68000, max: 95000, median: 80000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'plumber': {
    careerName: 'Plumber',
    entryLevel: { min: 33000, max: 42000, median: 37000 },
    midLevel: { min: 45000, max: 62000, median: 53000 },
    seniorLevel: { min: 65000, max: 90000, median: 77000 },
    growthRate: '2% (slower than average)',
    source: SOURCE,
  },
  'hvac technician': {
    careerName: 'HVAC Technician',
    entryLevel: { min: 32000, max: 42000, median: 37000 },
    midLevel: { min: 42000, max: 58000, median: 50000 },
    seniorLevel: { min: 58000, max: 82000, median: 70000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'welder': {
    careerName: 'Welder',
    entryLevel: { min: 30000, max: 38000, median: 34000 },
    midLevel: { min: 38000, max: 52000, median: 45000 },
    seniorLevel: { min: 52000, max: 75000, median: 63000 },
    growthRate: '2% (slower than average)',
    source: SOURCE,
  },
  'carpenter': {
    careerName: 'Carpenter',
    entryLevel: { min: 30000, max: 38000, median: 34000 },
    midLevel: { min: 40000, max: 55000, median: 47000 },
    seniorLevel: { min: 55000, max: 78000, median: 66000 },
    growthRate: '2% (slower than average)',
    source: SOURCE,
  },
  'automotive technician': {
    careerName: 'Automotive Technician',
    entryLevel: { min: 28000, max: 38000, median: 33000 },
    midLevel: { min: 38000, max: 52000, median: 45000 },
    seniorLevel: { min: 52000, max: 72000, median: 62000 },
    growthRate: '1% (little or no change)',
    source: SOURCE,
  },
  'construction manager': {
    careerName: 'Construction Manager',
    entryLevel: { min: 50000, max: 68000, median: 58000 },
    midLevel: { min: 72000, max: 100000, median: 86000 },
    seniorLevel: { min: 102000, max: 145000, median: 122000 },
    growthRate: '5% (about as fast as average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // DATABASE / IT SUPPORT
  // ═══════════════════════════════════════════════════════════════
  'database administrator': {
    careerName: 'Database Administrator',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 70000, max: 95000, median: 82000 },
    seniorLevel: { min: 100000, max: 135000, median: 118000 },
    growthRate: '8% (faster than average)',
    source: SOURCE,
  },
  'it support specialist': {
    careerName: 'IT Support Specialist',
    entryLevel: { min: 32000, max: 45000, median: 38000 },
    midLevel: { min: 45000, max: 62000, median: 53000 },
    seniorLevel: { min: 62000, max: 85000, median: 73000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
  'solutions architect': {
    careerName: 'Solutions Architect',
    entryLevel: { min: 75000, max: 100000, median: 87000 },
    midLevel: { min: 110000, max: 145000, median: 128000 },
    seniorLevel: { min: 150000, max: 200000, median: 175000 },
    growthRate: '15% (much faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // FINANCE / ACCOUNTING
  // ═══════════════════════════════════════════════════════════════
  'accountant': {
    careerName: 'Accountant',
    entryLevel: { min: 42000, max: 55000, median: 48000 },
    midLevel: { min: 58000, max: 78000, median: 68000 },
    seniorLevel: { min: 80000, max: 110000, median: 95000 },
    growthRate: '4% (about as fast as average)',
    source: SOURCE,
  },
  'financial analyst': {
    careerName: 'Financial Analyst',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 68000, max: 95000, median: 82000 },
    seniorLevel: { min: 100000, max: 140000, median: 120000 },
    growthRate: '8% (faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // LEGAL
  // ═══════════════════════════════════════════════════════════════
  'paralegal': {
    careerName: 'Paralegal',
    entryLevel: { min: 35000, max: 45000, median: 40000 },
    midLevel: { min: 48000, max: 62000, median: 55000 },
    seniorLevel: { min: 65000, max: 85000, median: 75000 },
    growthRate: '4% (about as fast as average)',
    source: SOURCE,
  },
  'lawyer': {
    careerName: 'Lawyer',
    entryLevel: { min: 55000, max: 78000, median: 66000 },
    midLevel: { min: 82000, max: 130000, median: 105000 },
    seniorLevel: { min: 135000, max: 200000, median: 168000 },
    growthRate: '8% (faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // HUMAN RESOURCES
  // ═══════════════════════════════════════════════════════════════
  'human resources manager': {
    careerName: 'Human Resources Manager',
    entryLevel: { min: 48000, max: 62000, median: 55000 },
    midLevel: { min: 68000, max: 95000, median: 82000 },
    seniorLevel: { min: 100000, max: 140000, median: 120000 },
    growthRate: '5% (about as fast as average)',
    source: SOURCE,
  },
  'recruiter': {
    careerName: 'Recruiter',
    entryLevel: { min: 35000, max: 48000, median: 42000 },
    midLevel: { min: 50000, max: 72000, median: 60000 },
    seniorLevel: { min: 75000, max: 105000, median: 90000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // LOGISTICS / SUPPLY CHAIN
  // ═══════════════════════════════════════════════════════════════
  'supply chain manager': {
    careerName: 'Supply Chain Manager',
    entryLevel: { min: 48000, max: 65000, median: 56000 },
    midLevel: { min: 70000, max: 95000, median: 82000 },
    seniorLevel: { min: 100000, max: 140000, median: 120000 },
    growthRate: '18% (much faster than average)',
    source: SOURCE,
  },
  'logistics coordinator': {
    careerName: 'Logistics Coordinator',
    entryLevel: { min: 32000, max: 42000, median: 37000 },
    midLevel: { min: 42000, max: 58000, median: 50000 },
    seniorLevel: { min: 58000, max: 78000, median: 68000 },
    growthRate: '18% (much faster than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // REAL ESTATE / ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════
  'real estate agent': {
    careerName: 'Real Estate Agent',
    entryLevel: { min: 25000, max: 40000, median: 32000 },
    midLevel: { min: 42000, max: 75000, median: 56000 },
    seniorLevel: { min: 78000, max: 130000, median: 102000 },
    growthRate: '3% (slower than average)',
    source: SOURCE,
  },
  'architect': {
    careerName: 'Architect',
    entryLevel: { min: 45000, max: 60000, median: 52000 },
    midLevel: { min: 65000, max: 90000, median: 78000 },
    seniorLevel: { min: 92000, max: 135000, median: 112000 },
    growthRate: '3% (slower than average)',
    source: SOURCE,
  },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE / RESEARCH
  // ═══════════════════════════════════════════════════════════════
  'research scientist': {
    careerName: 'Research Scientist',
    entryLevel: { min: 50000, max: 68000, median: 58000 },
    midLevel: { min: 72000, max: 100000, median: 86000 },
    seniorLevel: { min: 105000, max: 145000, median: 125000 },
    growthRate: '10% (faster than average)',
    source: SOURCE,
  },
  'biomedical engineer': {
    careerName: 'Biomedical Engineer',
    entryLevel: { min: 52000, max: 68000, median: 60000 },
    midLevel: { min: 72000, max: 100000, median: 86000 },
    seniorLevel: { min: 100000, max: 140000, median: 120000 },
    growthRate: '5% (about as fast as average)',
    source: SOURCE,
  },
  'environmental scientist': {
    careerName: 'Environmental Scientist',
    entryLevel: { min: 40000, max: 52000, median: 46000 },
    midLevel: { min: 55000, max: 75000, median: 65000 },
    seniorLevel: { min: 78000, max: 105000, median: 90000 },
    growthRate: '6% (about as fast as average)',
    source: SOURCE,
  },
};

export function getSalaryData(careerName: string): CareerSalaryData | null {
  return SALARY_DATA[careerName.toLowerCase()] || null;
}

export function formatSalaryAmount(amount: number): string {
  if (amount >= 1000) return `$${Math.round(amount / 1000)}k`;
  return `$${amount}`;
}

export function formatSalaryRange(min: number, max: number): string {
  return `${formatSalaryAmount(min)} - ${formatSalaryAmount(max)}`;
}
