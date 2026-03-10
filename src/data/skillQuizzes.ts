// Skill verification quiz questions organized by category

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillQuiz {
  skill: string;
  category: string;
  questions: QuizQuestion[];
}

export const SKILL_QUIZZES: SkillQuiz[] = [
  {
    skill: 'JavaScript',
    category: 'Programming',
    questions: [
      {
        id: 'js1',
        question: 'What does "===" do in JavaScript?',
        options: ['Assignment', 'Loose equality', 'Strict equality', 'Not equal'],
        correctIndex: 2,
        explanation: '=== checks both value and type (strict equality), while == only checks value.',
      },
      {
        id: 'js2',
        question: 'Which method adds an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctIndex: 0,
        explanation: 'push() adds to the end, unshift() adds to the beginning.',
      },
      {
        id: 'js3',
        question: 'What is a closure in JavaScript?',
        options: [
          'A way to close a browser window',
          'A function that has access to outer scope variables',
          'A method to end a loop',
          'A type of error handler',
        ],
        correctIndex: 1,
        explanation: 'A closure is a function that retains access to variables from its outer scope.',
      },
      {
        id: 'js4',
        question: 'What does JSON stand for?',
        options: [
          'JavaScript Object Notation',
          'Java Standard Object Notation',
          'JavaScript Oriented Naming',
          'Java Syntax Object Network',
        ],
        correctIndex: 0,
        explanation: 'JSON = JavaScript Object Notation, a lightweight data format.',
      },
      {
        id: 'js5',
        question: 'Which keyword declares a block-scoped variable?',
        options: ['var', 'let', 'function', 'global'],
        correctIndex: 1,
        explanation: 'let and const are block-scoped; var is function-scoped.',
      },
    ],
  },
  {
    skill: 'Python',
    category: 'Programming',
    questions: [
      {
        id: 'py1',
        question: 'What is a Python list comprehension?',
        options: [
          'A way to read files',
          'A concise way to create lists',
          'A debugging tool',
          'A type of loop',
        ],
        correctIndex: 1,
        explanation: 'List comprehensions create new lists from iterables in a single line: [x for x in range(10)]',
      },
      {
        id: 'py2',
        question: 'What does "pip" stand for?',
        options: [
          'Python Installation Package',
          'Pip Installs Packages',
          'Python Import Protocol',
          'Package Install Program',
        ],
        correctIndex: 1,
        explanation: 'pip is a recursive acronym: Pip Installs Packages.',
      },
      {
        id: 'py3',
        question: 'Which data type is immutable in Python?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctIndex: 2,
        explanation: 'Tuples are immutable — they cannot be changed after creation.',
      },
      {
        id: 'py4',
        question: 'What is the output of len("Hello")?',
        options: ['4', '5', '6', 'Error'],
        correctIndex: 1,
        explanation: '"Hello" has 5 characters, so len() returns 5.',
      },
      {
        id: 'py5',
        question: 'What keyword is used to handle exceptions?',
        options: ['catch', 'except', 'handle', 'error'],
        correctIndex: 1,
        explanation: 'Python uses try/except blocks for exception handling.',
      },
    ],
  },
  {
    skill: 'HTML & CSS',
    category: 'Web Development',
    questions: [
      {
        id: 'html1',
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Hyper Transfer Markup Language',
          'Home Tool Markup Language',
        ],
        correctIndex: 0,
        explanation: 'HTML = HyperText Markup Language.',
      },
      {
        id: 'html2',
        question: 'Which CSS property makes text bold?',
        options: ['text-style', 'font-weight', 'text-weight', 'font-bold'],
        correctIndex: 1,
        explanation: 'font-weight: bold; makes text bold in CSS.',
      },
      {
        id: 'html3',
        question: 'What is Flexbox used for?',
        options: ['Database queries', 'One-dimensional layouts', 'Image editing', 'Server routing'],
        correctIndex: 1,
        explanation: 'Flexbox is a CSS layout model for one-dimensional arrangements.',
      },
      {
        id: 'html4',
        question: 'Which HTML tag creates a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctIndex: 1,
        explanation: 'The <a> (anchor) tag creates hyperlinks.',
      },
      {
        id: 'html5',
        question: 'What is the CSS box model order from inside out?',
        options: [
          'Content, Padding, Border, Margin',
          'Margin, Border, Padding, Content',
          'Content, Border, Padding, Margin',
          'Padding, Content, Border, Margin',
        ],
        correctIndex: 0,
        explanation: 'The box model goes: Content > Padding > Border > Margin.',
      },
    ],
  },
  {
    skill: 'React',
    category: 'Web Development',
    questions: [
      {
        id: 'react1',
        question: 'What is a React component?',
        options: [
          'A CSS class',
          'A reusable piece of UI',
          'A database table',
          'A server endpoint',
        ],
        correctIndex: 1,
        explanation: 'Components are reusable, self-contained pieces of UI.',
      },
      {
        id: 'react2',
        question: 'What hook is used for side effects?',
        options: ['useState', 'useEffect', 'useRef', 'useMemo'],
        correctIndex: 1,
        explanation: 'useEffect runs side effects like API calls, timers, etc.',
      },
      {
        id: 'react3',
        question: 'What does JSX stand for?',
        options: [
          'JavaScript XML',
          'Java Syntax Extension',
          'JSON Extended',
          'JavaScript Extra',
        ],
        correctIndex: 0,
        explanation: 'JSX = JavaScript XML, a syntax extension for React.',
      },
      {
        id: 'react4',
        question: 'How do you pass data from parent to child?',
        options: ['State', 'Props', 'Context', 'Refs'],
        correctIndex: 1,
        explanation: 'Props (properties) pass data from parent to child components.',
      },
      {
        id: 'react5',
        question: 'What is the virtual DOM?',
        options: [
          'A copy of the server',
          'An in-memory representation of the real DOM',
          'A CSS framework',
          'A testing tool',
        ],
        correctIndex: 1,
        explanation: 'The virtual DOM is a lightweight copy of the actual DOM for efficient updates.',
      },
    ],
  },
  {
    skill: 'SQL',
    category: 'Data',
    questions: [
      {
        id: 'sql1',
        question: 'What SQL clause filters rows?',
        options: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
        correctIndex: 2,
        explanation: 'WHERE filters rows based on conditions.',
      },
      {
        id: 'sql2',
        question: 'What does JOIN do?',
        options: [
          'Deletes records',
          'Combines rows from multiple tables',
          'Creates a new table',
          'Sorts results',
        ],
        correctIndex: 1,
        explanation: 'JOIN combines rows from two or more tables based on a related column.',
      },
      {
        id: 'sql3',
        question: 'Which keyword removes duplicate rows?',
        options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'SINGLE'],
        correctIndex: 1,
        explanation: 'SELECT DISTINCT removes duplicate rows from results.',
      },
      {
        id: 'sql4',
        question: 'What is a PRIMARY KEY?',
        options: [
          'The first column in a table',
          'A unique identifier for each row',
          'The password for the database',
          'The table name',
        ],
        correctIndex: 1,
        explanation: 'A primary key uniquely identifies each record in a table.',
      },
      {
        id: 'sql5',
        question: 'Which statement adds new rows?',
        options: ['ADD', 'INSERT INTO', 'CREATE', 'APPEND'],
        correctIndex: 1,
        explanation: 'INSERT INTO adds new rows to a table.',
      },
    ],
  },
  {
    skill: 'Git',
    category: 'Tools',
    questions: [
      {
        id: 'git1',
        question: 'What does "git commit" do?',
        options: [
          'Uploads code to GitHub',
          'Saves a snapshot of staged changes',
          'Downloads code from remote',
          'Creates a new branch',
        ],
        correctIndex: 1,
        explanation: 'git commit saves staged changes as a new snapshot in the local repo.',
      },
      {
        id: 'git2',
        question: 'What is a branch in Git?',
        options: [
          'A copy of a file',
          'An independent line of development',
          'A type of merge conflict',
          'A remote server',
        ],
        correctIndex: 1,
        explanation: 'Branches allow you to develop features in isolation.',
      },
      {
        id: 'git3',
        question: 'What does "git pull" do?',
        options: [
          'Pushes local commits',
          'Fetches and merges remote changes',
          'Creates a pull request',
          'Deletes a branch',
        ],
        correctIndex: 1,
        explanation: 'git pull fetches changes from remote and merges them into your branch.',
      },
      {
        id: 'git4',
        question: 'How do you stage all changed files?',
        options: ['git commit -a', 'git add .', 'git stage all', 'git push -all'],
        correctIndex: 1,
        explanation: '"git add ." stages all changes in the current directory.',
      },
      {
        id: 'git5',
        question: 'What is a merge conflict?',
        options: [
          'When two branches have incompatible changes to the same lines',
          'When a branch is deleted',
          'When a commit fails',
          'When the remote is unreachable',
        ],
        correctIndex: 0,
        explanation: 'Merge conflicts occur when the same lines were modified differently in two branches.',
      },
    ],
  },
];

export function getQuizForSkill(skill: string): SkillQuiz | undefined {
  const lower = skill.toLowerCase().trim();
  return SKILL_QUIZZES.find(
    (q) => q.skill.toLowerCase() === lower || lower.includes(q.skill.toLowerCase()),
  );
}

export function getAvailableQuizSkills(): string[] {
  return SKILL_QUIZZES.map((q) => q.skill);
}
