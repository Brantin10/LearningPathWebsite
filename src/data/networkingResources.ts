import { NetworkingCategory } from '../types';

export const NETWORKING_DATA: NetworkingCategory[] = [
  // ── 1. Coding ─────────────────────────────────────────────────
  {
    category: 'Coding',
    communities: [
      {
        title: 'r/learnprogramming',
        url: 'https://www.reddit.com/r/learnprogramming/',
        type: 'reddit',
        description:
          'Beginner-friendly subreddit for learning to code, asking questions, and sharing progress.',
      },
      {
        title: 'r/cscareerquestions',
        url: 'https://www.reddit.com/r/cscareerquestions/',
        type: 'reddit',
        description:
          'Career advice, resume reviews, and interview prep for software developers.',
      },
      {
        title: 'The Coding Den',
        url: 'https://discord.gg/code',
        type: 'discord',
        description:
          'Large Discord community for programmers of all levels with language-specific channels.',
      },
      {
        title: 'Dev.to Community',
        url: 'https://dev.to/',
        type: 'website',
        description:
          'Open-source blogging platform where developers share tutorials, insights, and career stories.',
      },
      {
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com/',
        type: 'forum',
        description:
          'The largest Q&A community for programmers to ask and answer technical questions.',
      },
    ],
    tips: [
      'Contribute to open-source projects on GitHub to build a public portfolio and connect with maintainers.',
      'Attend local meetups or virtual hackathons to meet other developers and practice teamwork.',
      'Write blog posts or short tutorials about what you learn; teaching others builds credibility.',
      'Participate in code review exchanges; reviewing and being reviewed teaches you industry norms.',
      'Join language-specific communities (e.g., r/reactjs, r/python) to get targeted help and stay current.',
    ],
    mentorshipAdvice: [
      'Look for mentorship programs on platforms like Exercism.io, which pair learners with experienced reviewers.',
      'Reach out to developers whose blog posts or talks you admire with a specific, thoughtful question.',
      'Offer to help junior developers in forums; mentoring others deepens your own understanding.',
      'Set clear goals with a mentor, such as completing a project or preparing for interviews, so sessions stay focused.',
      'Be consistent: a short weekly check-in with a mentor is more valuable than sporadic long conversations.',
    ],
  },

  // ── 2. Cloud / DevOps ─────────────────────────────────────────
  {
    category: 'Cloud / DevOps',
    communities: [
      {
        title: 'r/devops',
        url: 'https://www.reddit.com/r/devops/',
        type: 'reddit',
        description:
          'Discussions on CI/CD, infrastructure as code, containers, and DevOps culture.',
      },
      {
        title: 'r/aws',
        url: 'https://www.reddit.com/r/aws/',
        type: 'reddit',
        description:
          'Community for AWS users sharing tips, certification advice, and architecture patterns.',
      },
      {
        title: 'DevOps Engineers',
        url: 'https://discord.gg/devops',
        type: 'discord',
        description:
          'Discord server focused on Kubernetes, Terraform, cloud platforms, and automation.',
      },
      {
        title: 'Cloud Native Computing Foundation',
        url: 'https://www.cncf.io/community/',
        type: 'website',
        description:
          'The CNCF community hub for Kubernetes, Prometheus, and cloud-native project contributors.',
      },
      {
        title: 'LinkedIn - Cloud Computing Group',
        url: 'https://www.linkedin.com/groups/61513/',
        type: 'linkedin',
        description:
          'Large LinkedIn group for cloud professionals to share job leads, articles, and certifications.',
      },
    ],
    tips: [
      'Earn cloud certifications (AWS Solutions Architect, Azure Fundamentals) and share your journey publicly.',
      'Contribute to open-source IaC modules (Terraform, Pulumi) to demonstrate practical skills.',
      'Attend KubeCon, re:Invent, or local cloud meetups to build relationships with platform engineers.',
      'Write infrastructure post-mortems or architecture decision records to showcase problem-solving skills.',
      'Follow DevOps thought leaders on LinkedIn and engage thoughtfully with their content.',
    ],
    mentorshipAdvice: [
      'Find a mentor who has achieved the cloud certification you are targeting; they can guide your study plan.',
      'Ask senior DevOps engineers about their on-call and incident response workflows to learn real-world practices.',
      'Shadow a platform team if possible; observing production infrastructure decisions is invaluable.',
      'Request feedback on your architecture diagrams and Terraform code to level up quickly.',
      'Join a study group for certification exams; peer accountability and shared resources accelerate learning.',
    ],
  },

  // ── 3. AI / Machine Learning ──────────────────────────────────
  {
    category: 'AI / Machine Learning',
    communities: [
      {
        title: 'r/MachineLearning',
        url: 'https://www.reddit.com/r/MachineLearning/',
        type: 'reddit',
        description:
          'Research-oriented subreddit covering papers, industry news, and ML engineering.',
      },
      {
        title: 'r/datascience',
        url: 'https://www.reddit.com/r/datascience/',
        type: 'reddit',
        description:
          'Career discussions, portfolio advice, and tool comparisons for data scientists.',
      },
      {
        title: 'MLOps Community',
        url: 'https://discord.gg/mlops',
        type: 'discord',
        description:
          'Discord server for ML engineers focusing on deployment, monitoring, and production ML systems.',
      },
      {
        title: 'Kaggle Community',
        url: 'https://www.kaggle.com/discussions',
        type: 'forum',
        description:
          'Discussion forums tied to Kaggle competitions, datasets, and notebook sharing.',
      },
      {
        title: 'LinkedIn - Artificial Intelligence & Deep Learning',
        url: 'https://www.linkedin.com/groups/8122953/',
        type: 'linkedin',
        description:
          'LinkedIn group for AI professionals to discuss trends, research, and career opportunities.',
      },
    ],
    tips: [
      'Compete in Kaggle challenges to build a ranked profile that employers recognize.',
      'Reproduce a published paper and share your implementation on GitHub with a clear write-up.',
      'Present at local AI/ML meetups or record short explainer videos to establish thought leadership.',
      'Collaborate on cross-functional projects that combine ML with product, design, or business teams.',
      'Stay active in research communities by reading and discussing papers on arXiv and Twitter/X.',
    ],
    mentorshipAdvice: [
      'Reach out to researchers whose papers you have read; a specific comment about their work makes outreach memorable.',
      'Seek mentors who work in the ML subfield you care about (NLP, computer vision, recommender systems, etc.).',
      'Ask your mentor to review your Kaggle notebooks or project code for best practices you might be missing.',
      'Discuss the balance between research depth and engineering breadth with experienced ML professionals.',
      'Join reading groups that discuss recent papers weekly; this is where many mentorship connections form naturally.',
    ],
  },

  // ── 4. Management ─────────────────────────────────────────────
  {
    category: 'Management',
    communities: [
      {
        title: 'r/ExperiencedDevs',
        url: 'https://www.reddit.com/r/ExperiencedDevs/',
        type: 'reddit',
        description:
          'Discussions on technical leadership, people management, and senior engineering career paths.',
      },
      {
        title: 'r/projectmanagement',
        url: 'https://www.reddit.com/r/projectmanagement/',
        type: 'reddit',
        description:
          'Community for project and program managers to discuss methodologies, tools, and certifications.',
      },
      {
        title: 'Rands Leadership Slack',
        url: 'https://randsinrepose.com/welcome-to-rands-leadership-slack/',
        type: 'website',
        description:
          'Invite-based Slack community for engineering managers and leaders with thousands of members.',
      },
      {
        title: 'LinkedIn - Project Management Professional Network',
        url: 'https://www.linkedin.com/groups/59/',
        type: 'linkedin',
        description:
          'One of the largest LinkedIn groups for PMP-certified and aspiring project managers.',
      },
      {
        title: 'Manager Tools Forum',
        url: 'https://www.manager-tools.com/forums',
        type: 'forum',
        description:
          'Forum companion to the Manager Tools podcast covering one-on-ones, feedback, and coaching.',
      },
    ],
    tips: [
      'Practice giving structured feedback in every one-on-one; this is the single most impactful management skill.',
      'Attend leadership conferences like LeadDev or QCon to learn from experienced engineering leaders.',
      'Build your internal network across departments; cross-functional relationships help you unblock your team.',
      'Write internal documents (RFCs, strategy memos) to practice influencing without authority.',
      'Seek 360-degree feedback regularly to identify blind spots in your leadership style.',
    ],
    mentorshipAdvice: [
      'Find a mentor who has managed teams of the size you aspire to lead and learn how they scaled.',
      'Ask experienced managers about their biggest mistakes; failure stories teach more than success stories.',
      'Practice difficult conversation scenarios with your mentor before having them with your direct reports.',
      'Discuss your management philosophy with your mentor to refine your leadership identity.',
      'Look for a mentor outside your company to get unbiased perspective on organizational dynamics.',
    ],
  },

  // ── 5. Sales / Consulting ─────────────────────────────────────
  {
    category: 'Sales / Consulting',
    communities: [
      {
        title: 'r/sales',
        url: 'https://www.reddit.com/r/sales/',
        type: 'reddit',
        description:
          'Active community for sales professionals sharing scripts, strategies, and career advice.',
      },
      {
        title: 'r/consulting',
        url: 'https://www.reddit.com/r/consulting/',
        type: 'reddit',
        description:
          'Discussions on consulting careers, case interviews, and life at MBB and boutique firms.',
      },
      {
        title: 'Sales Professionals',
        url: 'https://discord.gg/sales',
        type: 'discord',
        description:
          'Discord community for B2B and B2C sales reps to share wins, losses, and techniques.',
      },
      {
        title: 'LinkedIn - Sales Best Practices',
        url: 'https://www.linkedin.com/groups/100825/',
        type: 'linkedin',
        description:
          'LinkedIn group focused on modern sales methodologies, CRM tools, and pipeline management.',
      },
      {
        title: 'Sales Hacker',
        url: 'https://www.saleshacker.com/',
        type: 'website',
        description:
          'Community and content hub for B2B sales professionals with webinars, guides, and forums.',
      },
    ],
    tips: [
      'Build genuine relationships on LinkedIn by commenting thoughtfully on prospects\' posts before reaching out.',
      'Attend industry trade shows and conferences to meet potential clients and partners face to face.',
      'Develop a personal brand around your niche expertise; publish case studies and client success stories.',
      'Practice your elevator pitch with peers and refine it based on feedback until it feels natural.',
      'Join industry-specific associations (e.g., AA-ISP for inside sales) for structured networking events.',
    ],
    mentorshipAdvice: [
      'Find a top performer at your company and ask to shadow their calls and client meetings.',
      'Ask your mentor to role-play objection handling scenarios so you can practice in a safe environment.',
      'Learn how your mentor builds and maintains a pipeline; their system likely evolved over years of trial and error.',
      'Discuss territory planning and account prioritization strategies with an experienced sales leader.',
      'Seek mentors who have transitioned between sales and consulting to understand both career paths.',
    ],
  },

  // ── 6. Creative / Design ──────────────────────────────────────
  {
    category: 'Creative / Design',
    communities: [
      {
        title: 'r/UXDesign',
        url: 'https://www.reddit.com/r/UXDesign/',
        type: 'reddit',
        description:
          'Community for UX designers to discuss portfolio reviews, career paths, and design systems.',
      },
      {
        title: 'r/graphic_design',
        url: 'https://www.reddit.com/r/graphic_design/',
        type: 'reddit',
        description:
          'Subreddit for graphic designers sharing work, critiques, and freelancing tips.',
      },
      {
        title: 'Design Buddies',
        url: 'https://discord.gg/designbuddies',
        type: 'discord',
        description:
          'Large Discord community for designers of all levels with portfolio reviews and job postings.',
      },
      {
        title: 'Dribbble Community',
        url: 'https://dribbble.com/',
        type: 'website',
        description:
          'Portfolio platform where designers showcase work, find jobs, and connect with teams.',
      },
      {
        title: 'LinkedIn - User Experience Professionals',
        url: 'https://www.linkedin.com/groups/1854/',
        type: 'linkedin',
        description:
          'LinkedIn group for UX professionals to share research findings, job openings, and tools.',
      },
    ],
    tips: [
      'Maintain an up-to-date portfolio on Dribbble or Behance; it is your primary networking asset.',
      'Participate in design challenges (e.g., Daily UI) and share your work to attract feedback and followers.',
      'Attend local design meetups or virtual events hosted by AIGA, IxDA, or local UX groups.',
      'Offer free design critiques to others in communities; giving feedback makes you visible and builds reputation.',
      'Collaborate with developers on side projects to strengthen your cross-functional skills and expand your network.',
    ],
    mentorshipAdvice: [
      'Ask a senior designer to review your portfolio and give honest feedback on case study structure.',
      'Seek mentors who work at the type of company you aspire to join (agency, startup, big tech, freelance).',
      'Learn how your mentor approaches design critique sessions; their framework will improve your own reviews.',
      'Discuss the business side of design with your mentor: stakeholder management, metrics, and ROI of design work.',
      'Find a mentor through ADPList, which offers free mentorship sessions with experienced designers worldwide.',
    ],
  },

  // ── 7. Healthcare ─────────────────────────────────────────────
  {
    category: 'Healthcare',
    communities: [
      {
        title: 'r/medicine',
        url: 'https://www.reddit.com/r/medicine/',
        type: 'reddit',
        description:
          'Subreddit for healthcare professionals to discuss clinical practice, research, and career topics.',
      },
      {
        title: 'r/nursing',
        url: 'https://www.reddit.com/r/nursing/',
        type: 'reddit',
        description:
          'Active community for nurses sharing experiences, advice, and support across specialties.',
      },
      {
        title: 'Healthcare Professionals Network',
        url: 'https://discord.gg/healthcare',
        type: 'discord',
        description:
          'Discord server connecting nurses, physicians, pharmacists, and allied health professionals.',
      },
      {
        title: 'LinkedIn - Healthcare Professionals Network',
        url: 'https://www.linkedin.com/groups/69/',
        type: 'linkedin',
        description:
          'LinkedIn group for healthcare workers to share industry news, job leads, and continuing education.',
      },
      {
        title: 'Student Doctor Network',
        url: 'https://www.studentdoctor.net/forums/',
        type: 'forum',
        description:
          'Forum for pre-med, medical, dental, and pharmacy students with career guidance and admissions advice.',
      },
    ],
    tips: [
      'Join your professional association (AMA, ANA, APHA) early; student memberships are usually discounted.',
      'Attend healthcare conferences and grand rounds to meet specialists and stay current on evidence-based practice.',
      'Volunteer at community health events to expand your network beyond your immediate clinical setting.',
      'Build relationships with professionals in adjacent fields (social work, public health, health IT) for a broader perspective.',
      'Share clinical insights or patient education content on LinkedIn to establish your professional presence.',
    ],
    mentorshipAdvice: [
      'Ask attending physicians or senior nurses to observe and give feedback during clinical rotations.',
      'Seek mentors who have followed the career trajectory you want (e.g., bedside nursing to nurse practitioner).',
      'Discuss work-life balance honestly with your mentor; burnout is common and prevention strategies matter.',
      'Request introductions to your mentor\'s network; healthcare is a relationship-driven field where referrals matter.',
      'Find mentors through your professional association\'s formal mentorship matching programs.',
    ],
  },

  // ── 8. Education ──────────────────────────────────────────────
  {
    category: 'Education',
    communities: [
      {
        title: 'r/Teachers',
        url: 'https://www.reddit.com/r/Teachers/',
        type: 'reddit',
        description:
          'Large subreddit for K-12 teachers sharing classroom strategies, policy discussions, and support.',
      },
      {
        title: 'r/highereducation',
        url: 'https://www.reddit.com/r/highereducation/',
        type: 'reddit',
        description:
          'Community for university educators and administrators discussing academia and pedagogy.',
      },
      {
        title: 'Educators Discord',
        url: 'https://discord.gg/education',
        type: 'discord',
        description:
          'Discord server for teachers, tutors, and instructional designers to share resources and ideas.',
      },
      {
        title: 'Edutopia',
        url: 'https://www.edutopia.org/',
        type: 'website',
        description:
          'Community and resource hub by the George Lucas Educational Foundation for evidence-based teaching.',
      },
      {
        title: 'LinkedIn - Higher Education Teaching and Learning',
        url: 'https://www.linkedin.com/groups/2aborl/',
        type: 'linkedin',
        description:
          'LinkedIn group for educators to discuss pedagogy, edtech tools, and professional development.',
      },
    ],
    tips: [
      'Present at education conferences (ISTE, ASCD, local EdCamps) to share your methods and learn from peers.',
      'Collaborate with teachers in other subject areas or grade levels to broaden your professional circle.',
      'Create and share lesson plans or resources on Teachers Pay Teachers or Open Educational Resources to build visibility.',
      'Join local teacher unions or associations for structured networking, advocacy, and professional development.',
      'Engage in Twitter/X education chats (e.g., #edchat, #edtech) to connect with educators worldwide.',
    ],
    mentorshipAdvice: [
      'Ask experienced teachers to observe your classes and provide constructive feedback on your instruction.',
      'Find a mentor who teaches a similar subject or age group so their advice is directly applicable.',
      'Discuss classroom management strategies with veteran teachers; they have refined systems over decades.',
      'Seek mentors outside your school district to gain perspective on different curricula and student populations.',
      'Participate in your school\'s or district\'s formal mentoring program, especially during your first three years.',
    ],
  },
];

// ── Helper Functions ──────────────────────────────────────────────

export function getNetworkingForCategory(
  category: string,
): NetworkingCategory | undefined {
  return NETWORKING_DATA.find(
    (n) => n.category.toLowerCase() === category.toLowerCase(),
  );
}

export function mapCareerToNetworkingCategory(careerCategory: string): string {
  const lower = careerCategory.toLowerCase();

  if (
    lower.includes('software') ||
    lower.includes('web') ||
    lower.includes('mobile') ||
    lower.includes('developer') ||
    lower.includes('programming')
  )
    return 'Coding';

  if (
    lower.includes('cloud') ||
    lower.includes('devops') ||
    lower.includes('infrastructure') ||
    lower.includes('network')
  )
    return 'Cloud / DevOps';

  if (
    lower.includes('ai') ||
    lower.includes('data') ||
    lower.includes('machine learning') ||
    lower.includes('analyst')
  )
    return 'AI / Machine Learning';

  if (
    lower.includes('manage') ||
    lower.includes('lead') ||
    lower.includes('director') ||
    lower.includes('executive')
  )
    return 'Management';

  if (
    lower.includes('sales') ||
    lower.includes('consult') ||
    lower.includes('marketing') ||
    lower.includes('business')
  )
    return 'Sales / Consulting';

  if (
    lower.includes('design') ||
    lower.includes('creative') ||
    lower.includes('ux') ||
    lower.includes('art') ||
    lower.includes('media')
  )
    return 'Creative / Design';

  if (
    lower.includes('health') ||
    lower.includes('medical') ||
    lower.includes('nurse') ||
    lower.includes('pharm')
  )
    return 'Healthcare';

  if (
    lower.includes('teach') ||
    lower.includes('education') ||
    lower.includes('train') ||
    lower.includes('tutor')
  )
    return 'Education';

  return 'Coding'; // fallback
}
